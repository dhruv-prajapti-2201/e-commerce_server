const express=require('express');
const app=express();

const cloudinary=require('cloudinary');
const cors=require('cors');

const bodyParser = require('body-parser');

const userRoutes=require('./routes/user.routes');
const categoryRoutes=require('./routes/category.routes');
const sellerRoutes=require('./routes/seller.routes');
const productRoutes=require('./routes/product.routes');
const cartRoutes=require('./routes/cart.routes');
const orderRoutes=require('./routes/order.routes');

require('dotenv').config()
const PORT=process.env.SERVER_PORT | 5000;

cloudinary.v2.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRECT
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// app.use(express.json());
app.use(cors());

app.use('/api/',userRoutes);
app.use('/api/category/',categoryRoutes);
app.use('/api/seller/',sellerRoutes);
app.use('/api/product/',productRoutes);
app.use('/api/cart/',cartRoutes);
app.use('/api/order/',orderRoutes);

app.listen(PORT,()=>{
    console.log(`server is running on ${PORT} port`);
})