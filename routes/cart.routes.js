const {
  addProductToCart,
  getCartProducts,
  updateQuantity,
  deleteProduct,
} = require("../controller/cart.controller");

const { auth } = require("../middlewares/Auth");
const  Validator=require('../middlewares/validator')

const router = require("express").Router();

router.post("/add", auth,Validator('cart'), addProductToCart);
router.get("/get", auth, getCartProducts);
router.put("/update", auth, updateQuantity);
router.delete("/delete/:id", auth, deleteProduct);

module.exports = router;
