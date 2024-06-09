const getDataUri = require("../utils/dataUri");
const {
  products,
  seller_product,
  product_category,
  seller,
  category,
  sequelize,
} = require("./../models/index");
const cloudinary = require("cloudinary");

const saveProduct = async (req, res) => {
  const product_transaction = await sequelize.transaction();
  try {
    const { name, desc, price, quantity_in_stock, seller_id, category_name } =
      req.body;

    const category_item = await category.findOne({
      where: {
        name: category_name,
      },
      raw: true,
    });

    if (category_item === null) {
      return res.status(400).send({
        status: "error",
        message: "Category name is invalid!",
      });
    }

    const fileuri = getDataUri(req.file);
    const mycloud = await cloudinary.v2.uploader.upload(fileuri.content);

    let public_id = mycloud.public_id;
    let image_url = mycloud.secure_url;

    const newProduct = {
      name,
      desc,
      price: Number(price),
      image_url,
    };

    let savedProduct = await products.create(newProduct, {
      transaction: product_transaction,
    });

    const newCategoryProduct = {
      product_id: Number(savedProduct.id),
      category_id: Number(category_item.id),
    };

    let savedCategoryProduct = await product_category.create(
      newCategoryProduct,
      {
        transaction: product_transaction,
      }
    );

    const newSellerProduct = {
      product_id: Number(savedProduct.id),
      seller_id: Number(seller_id),
      quantity_in_stock: Number(quantity_in_stock),
    };

    let savedSellerProduct = await seller_product.create(newSellerProduct, {
      transaction: product_transaction,
    });

    await product_transaction.commit();

    return res.status(201).json({
      status: "success",
      message: "Product Added Successfully",
      data: null,
    });
  } catch (err) {
    console.log(err);

    await product_transaction.rollback();

    return res.status(500).send({
      status: "error",
      message: "something went wrong!",
    });
  }
};

const updateProduct = async (req, res) => {
  const product_transaction = await sequelize.transaction();
  try {
    const editedID = Number(req.params.id);

    const editedProduct = await products.findOne({
      where: {
        id: editedID,
      },
      raw: true,
    });

    if (editedProduct === null) {
      return res.status(400).send({
        status: "error",
        message: "Product not found!",
      });
    }

    const { name, desc, price, quantity_in_stock, seller_id, category_name } =
      req.body;

    const category_item = await category.findOne({
      where: {
        name: category_name,
      },
      raw: true,
    });

    if (category_item === null) {
      return res.status(400).send({
        status: "error",
        message: "Category name is invalid!",
      });
    }

    const fileuri = getDataUri(req.file);
    const uploadImage = await cloudinary.v2.uploader.upload(fileuri.content);

    //let public_id = mycloud.public_id;
    let image_url = uploadImage.secure_url;

    const updateProduct = {
      name,
      desc,
      price: Number(price),
      image_url,
    };

    let updatedProduct = await products.update(updateProduct, {
      where: {
        id: editedID,
      },
      transaction: product_transaction,
    });

    const updateSellerProduct = {
      quantity_in_stock: Number(quantity_in_stock),
    };

    let updateddSellerProduct = await seller_product.update(
      updateSellerProduct,
      {
        where: {
          product_id: editedID,
        },
        transaction: product_transaction,
      }
    );

    const updateCategoryProduct = {
      product_id: editedID,
      category_id: Number(category_item.id),
    };

    let updatedCategoryProduct = await product_category.update(
      updateCategoryProduct,
      {
        where: {
          product_id: editedID,
        },
        transaction: product_transaction,
      }
    );

    const publicId = editedProduct.image_url.match(/v\d+\/(.+)\.\w+$/)[1];

    await cloudinary.v2.uploader.destroy(publicId, function (error, result) {
      if (error) {
        throw new Error(`something wrong with cloudinary`);
      }
      console.log(result);
    });

    await product_transaction.commit();

    return res.status(201).json({
      status: "success",
      message: "Product Updated Successfully",
      data: null,
    });
  } catch (err) {
    console.log(err);

    await product_transaction.rollback();

    return res.status(500).send({
      status: "error",
      message: "something went wrong!",
    });
  }
};

const deleteProduct = async (req, res) => {
  const product_transaction = await sequelize.transaction();
  try {
    const productID = Number(req.params.id);

    const product = await products.findOne({
      where: {
        id: productID,
      },
      raw: true,
    });

    if (product === null) {
      return res.status(400).send({
        status: "error",
        message: "Product not found!",
      });
    }

    let deleteCategoryProduct = await product_category.destroy({
      where: {
        product_id: productID,
      },
      transaction: product_transaction,
    });

    let deleteSellerProduct = await seller_product.destroy({
      where: {
        product_id: productID,
      },
      transaction: product_transaction,
    });

    let deleteProduct = await products.destroy({
      where: {
        id: productID,
      },
      transaction: product_transaction,
    });

    const publicId = product.image_url.match(/v\d+\/(.+)\.\w+$/)[1];

    await cloudinary.v2.uploader.destroy(publicId, function (error, result) {
      if (error) {
        throw new Error(`something wrong with cloudinary`);
      }
      console.log(result);
    });

    await product_transaction.commit();

    return res.status(201).json({
      status: "success",
      message: "Product deleted Successfully",
      data: null,
    });
  } catch (err) {
    console.log(err);

    await product_transaction.rollback();

    return res.status(500).send({
      status: "error",
      message: "something went wrong!",
    });
  }
};

const getProduct = async (req, res) => {
  try {
    let data = await products.findAll({
      attributes: ["id", "name", "desc", "price", "image_url"],
      include: [
        {
          model: category,
          attributes: ["name"],
          through: { as: "product_category", attributes: [] },
        },
        {
          model: seller,
          attributes: ["name"],
          through: { as: "seller_product", attributes: ["quantity_in_stock"] },
        },
      ],
    });

    return res.status(200).json({
      status: "success",
      message: "Products fetched Successfully",
      data: data,
    });

    

  } catch (err) {
    console.log(err);
    return res.status(500).send({
      status: "error",
      message: "something went wrong!",
    });
  }
};

const getSingleProduct = async (req, res) => {
  try {

    const product_id=req.params.id;

    let data = await products.findAll({
      attributes: ["id", "name", "desc", "price", "image_url"],
      where:{
        id:product_id
      },
      include: [
        {
          model: category,
          attributes: ["name"],
          through: { as: "product_category", attributes: [] },
        },
        {
          model: seller,
          attributes: ["name"],
          through: { as: "seller_product", attributes: ["quantity_in_stock"] },
        },
      ],
    });

    if(data.length===0){
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }
    

    return res.status(200).json({
      status: "success",
      message: "Product fetched Successfully",
      data: data[0],
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      status: "error",
      message: "something went wrong!",
    });
  }
};

const getProductByCategory = async (req, res) => {
  try {
    let category_name = req.params.name;

    let categoryData=await category.findOne({
      where:{
        name:category_name
      },
      raw:true
    });

    if(categoryData===null){
      return res.status(404).json({
        status:'error',
        message:'category not found'
      })
    }
    
    let data = await products.findAll({
      attributes: ["id", "name", "desc", "price", "image_url"],
      include: [
        {
          model: category,
          attributes: ["name"],
          through: { as: "product_category", attributes: [], },
          where:{
            name:category_name
          }
        },
        {
          model: seller,
          attributes: ["name"],
          through: { as: "seller_product", attributes: ["quantity_in_stock"] },
        },
      ],
    });
    

    return res.status(200).json({
      status: "success",
      message: "Products fetched Successfully",
      data: data,
    });


  } catch (err) {
    console.log(err);
    
    return res.status(500).send({
      status: "error",
      message: "something went wrong!",
    });
  }
};

module.exports = {
  saveProduct,
  updateProduct,
  getProduct,
  deleteProduct,
  getProductByCategory,
  getSingleProduct
};
