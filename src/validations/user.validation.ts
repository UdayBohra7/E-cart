import Joi from 'joi';

const updateMe = {
  body: Joi.object().keys({
    name: Joi.string().optional(),
    phone: Joi.string().allow('', null).optional(),
  }),
};

export default {
  updateMe,
};
