import { Navigate } from 'react-router-dom';

export const commonRoutes = [
  {
    path: "/user",
    element: <Navigate to={"/owner"} />,
  },
];
