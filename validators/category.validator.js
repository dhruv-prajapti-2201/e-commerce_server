const Joi = require('joi');

const loginSchema = Joi.object({
    name: Joi.string().required(),
    desc: Joi.string().allow('',null)
});

module.exports = loginSchema;