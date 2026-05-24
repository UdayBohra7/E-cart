import Joi from 'joi';

const checkout = {
  body: Joi.object().keys({
    items: Joi.array()
      .items(
        Joi.object().keys({
          productId: Joi.number().integer().required(),
          quantity: Joi.number().integer().min(1).required(),
        })
      )
      .min(1)
      .required(),
  }),
};

const confirm = {
  body: Joi.object().keys({
    items: Joi.array()
      .items(
        Joi.object().keys({
          productId: Joi.number().integer().required(),
          quantity: Joi.number().integer().min(1).required(),
        })
      )
      .min(1)
      .required(),
    shippingAddress: Joi.string().required(),
    shippingCity: Joi.string().required(),
    shippingPostalCode: Joi.string().required(),
    razorpayPaymentId: Joi.string().required(),
    razorpayOrderId: Joi.string().required(),
    razorpaySignature: Joi.string().required(),
  }),
};

export default {
  checkout,
  confirm,
};
