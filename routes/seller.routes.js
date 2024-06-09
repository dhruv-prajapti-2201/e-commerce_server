const router=require('express').Router();
const { saveSeller, updateSeller, getSeller } = require('../controller/seller.controller');
const  Validator=require('../middlewares/validator')


router.post('/',Validator('seller'),saveSeller);
router.put('/:id',Validator('seller'),updateSeller);
router.get('/',getSeller);


module.exports=router;