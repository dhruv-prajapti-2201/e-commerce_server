const router = require("express").Router();
const {
  saveProduct,
  updateProduct,
  getProduct,
  deleteProduct,
  getProductByCategory,
  getSingleProduct,
} = require("../controller/product.controller");
const singleUpload = require("../middlewares/multer");
const Validator = require("../middlewares/validator");

router.post("/", singleUpload, saveProduct);
router.put("/:id", singleUpload, updateProduct);
router.delete("/:id", deleteProduct);
router.get("/", getProduct);
router.get("/:id", getSingleProduct);
router.get("/category/:name", getProductByCategory);

module.exports = router;
