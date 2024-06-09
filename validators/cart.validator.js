const Joi = require('joi');

const cartSchema = Joi.object({
    id: Joi.number().required(),
    quantity: Joi.number().required(),
    userID: Joi.number().required()
});

module.exports = cartSchema;