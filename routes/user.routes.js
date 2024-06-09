const { registerUser, loginUser } = require('../controller/user.controller');

const router=require('express').Router();

const  Validator=require('../middlewares/validator')


router.post('/register-user',Validator('register'),registerUser);
router.post('/login',Validator('login'),loginUser);



module.exports=router;