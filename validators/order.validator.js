const Joi = require("joi");

const orderSchema = Joi.object({
  address: {
    address1: Joi.string().required(),
    address2: Joi.string().allow("", null),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    pincode: Joi.number().required(),
  },
  userID: Joi.number().required(),
});

module.exports = orderSchema;
