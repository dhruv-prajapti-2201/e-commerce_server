const {
  createOrder,
  getOrders,
  getOrderItems,
  updateStatus,
} = require("../controller/order.controller");
const { auth } = require("../middlewares/Auth");
const  Validator=require('../middlewares/validator')

const router = require("express").Router();

router.post("/create", auth,Validator('order'), createOrder);
router.get("/get", auth, getOrders);
router.get("/items/:id", auth, getOrderItems);

//admin
router.put("/update", updateStatus);

module.exports = router;
