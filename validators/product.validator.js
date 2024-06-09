const Joi = require('joi');

const productSchema = Joi.object({
    name: Joi.string().required(),
    desc: Joi.string().required(),
    price: Joi.number().required(),
    quantity_in_stock:Joi.number().required(),
    seller_id: Joi.number().required(),
    category_name:Joi.string().required(),
});

module.exports = productSchema;