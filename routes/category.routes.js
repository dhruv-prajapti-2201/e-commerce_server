const router=require('express').Router();
const { saveCategory, updateCategory, getCategory } = require('../controller/category.controller');
const  Validator=require('../middlewares/validator')


router.post('/',Validator('category'),saveCategory);
router.put('/:id',Validator('category'),updateCategory);
router.get('/',getCategory);


module.exports=router;