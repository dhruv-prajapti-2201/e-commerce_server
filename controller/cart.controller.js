const {
  cart,
  cart_products,
  seller_product,
  products,
  Sequelize,
} = require("./../models/index");

const addProductToCart = async (req, res) => {
  try {
    const { id, quantity, userID } = req.body;    

    const cartData = await cart.findOne({
      where: {
        customer_id: userID,
      },
      raw: true,
    });

    const product = await products.findOne({
      where: {
        id,
      },
    });

    const available_qty=await seller_product.findOne({
      attributes:['quantity_in_stock'],
      where:{
        product_id:id
      },
      raw:true
    });

    if(available_qty.quantity_in_stock-Number(quantity)<0){
      return res.status(404).json({
        status: "error",
        message: "requested quentity not available",
      });
    }

    const cartProduct = await cart_products.create({
      cart_id: cartData.id,
      product_id: id,
      quantity,
    });

    const savedCartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      cart_products:{
        quantity,
      }
    };

    return res.status(201).json({
      status: "success",
      message: "Product Added to the Cart ",
      data: savedCartProduct,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).send({
      status: "error",
      message: "something went wrong!",
    });
  }
};

const getCartProducts = async (req, res) => {
  try {
    const { userID } = req.body;

    const cartProducts = await cart.findAll({
      attributes: [],
      include: [
        {
          model: products,
          attributes: ["id", "name", "price", "image_url"],
          through: { as: "cart_products", attributes: ["quantity"] },
        },
      ],
      where: {
        customer_id: userID,
      },
    });

    const cartData = JSON.parse(JSON.stringify(cartProducts));

    return res.status(201).json({
      status: "success",
      message: "Cart product fetched succesfully",
      data: cartData[0].products,
    });
  } catch (err) {
    return res.status(500).send({
      status: "error",
      message: "something went wrong!",
    });
  }
};

const updateQuantity = async (req, res) => {
  try {
    const { product_id, userID, qty } = req.body;

    const available_qty=await seller_product.findOne({
      attributes:['quantity_in_stock'],
      where:{
        product_id
      },
      raw:true
    });

    let remaining_qty=available_qty.quantity_in_stock-Number(qty);

    if(remaining_qty<1){
      return res.status(404).json({
        status: "remove",
        message: "Quantity not available, Out of Stock!",
        data:product_id
      });
    }
    
    const cartData = await cart.findOne({
      where: {
        customer_id: userID,
      },
      raw: true,
    });

    const updatedCart = await cart_products.update(
      {
        quantity: qty,
      },
      {
        where: {
          [Sequelize.Op.and]: {
            cart_id: cartData.id,
            product_id: product_id,
          },
        },
      }
    );

    if(updatedCart[0]===0){
      return res.status(404).json({
        status: "error",
        message: "Product not found in a Cart",
        data: updatedCart,
      });  
    }
    
    return res.status(200).json({
      status: "success",
      message: "Cart updated",
      data: updatedCart,
    });
  } catch (err) {
    console.log(err);
    
    return res.status(500).json({
      status: "error",
      message: "something went wrong!",
    });
  }
};

const deleteProduct =async (req,res) => {
  try {
    
    const product_id=Number(req.params.id);
    const { userID } = req.body;

    const cartData = await cart.findOne({
      where: {
        customer_id: userID,
      },
      raw: true,
    });
    
    const deletedCartProduct = await cart_products.destroy({
      where: {
        product_id,
        cart_id:cartData.id
      },
    });

    if (deletedCartProduct === 1) {
      return res.status(200).json({
        status: "success",
        message: `Product removed successfully`,
        data:product_id
      });
    }

    return res.status(404).json({
      status: "error",
      message: `Product not found`,
    });

  } catch (err) {
    return res.status(500).send({
      status: "error",
      message: "something went wrong!",
    });
  }
};

module.exports = {
  addProductToCart,
  getCartProducts,
  updateQuantity,
  deleteProduct,
};
