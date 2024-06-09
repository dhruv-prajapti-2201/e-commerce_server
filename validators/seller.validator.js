const Joi = require('joi');

const sellerSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    name: Joi.string().min(1).required(),
    phone:Joi.string().length(10).pattern(/^[0-9]+$/).required()
});

module.exports = sellerSchema;