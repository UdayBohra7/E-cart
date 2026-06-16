import express from 'express';
import path from 'path';
import fs from 'fs';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import passport from 'passport';
import httpStatus from 'http-status';
import config from './config/config';
import morgan from './config/morgan';
import { jwtStrategy } from './config/passport';
import { authLimiter } from './middlewares/rateLimiter';
import routes from './routes/v1';
import { errorConverter, errorHandler } from './middlewares/error';
import ApiError from './utils/ApiError';

const app = express();

// Enable 'trust proxy' so Express reads X-Forwarded-For headers from Railway proxy
app.set('trust proxy', 1);

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
// app.options('(.*)', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// v1 api routes
app.use('/v1', routes);

// Serve frontend static files
const frontendBuildPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendBuildPath));

// For all other routes, send back index.html for React SPA client-side routing
app.get('(.*)', (req, res, next) => {
  if (req.path.startsWith('/v1') || req.path.startsWith('/uploads')) {
    return next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
  }
  const indexPath = path.join(frontendBuildPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    next(new ApiError(httpStatus.NOT_FOUND, 'Frontend build not found. Please run the build script.'));
  }
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
