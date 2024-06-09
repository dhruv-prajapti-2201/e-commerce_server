const { Op } = require("sequelize");
const {
  cart_products,
  cart,
  products,
  order,
  order_product,
  sequelize,
  seller_product,
} = require("../models");

const createOrder = async (req, res) => {
  const order_transaction = await sequelize.transaction();

  try {
    let { address, userID } = req.body;
  
    address = JSON.stringify(address);

    const cartProducts = await cart.findAll({
      attributes: [],
      include: [
        {
          model: products,
          attributes: ["price", "id"],
          through: { as: "cart_products", attributes: ["quantity"] },
        },
      ],
      where: {
        customer_id: userID,
      },
    });

    const cartItem = JSON.parse(JSON.stringify(cartProducts[0]));

    if (cartItem.products.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "cart is empty",
      });
    }

    for (const item of cartItem.products) {
      const available_qty = await seller_product.findOne({
        attributes: ["quantity_in_stock"],
        where: {
          product_id: item.id,
        },
        raw: true,
      });

      if (
        available_qty.quantity_in_stock - Number(item.cart_products.quantity) <
        0
      ) {
        return res.status(404).json({
          status: "error",
          message: "one of the product not available",
        });
      }
    }

    for (const item of cartItem.products) {
      const available_qty = await seller_product.findOne({
        attributes: ["quantity_in_stock"],
        where: {
          product_id: item.id,
        },
        raw: true,
      });

      const update_qty = await seller_product.update(
        {
          quantity_in_stock:
            available_qty.quantity_in_stock -
            Number(item.cart_products.quantity),
        },
        {
          where: { product_id: item.id },
          transaction: order_transaction,
        }
      );
    }

    const totalAmount = cartItem.products.reduce((cur, acc) => {
      return cur + acc.price * acc.cart_products.quantity;
    }, 0);

    const currentDate = new Date();

    const savedOrder = await order.create(
      {
        customer_id: userID,
        order_date: currentDate,
        total_amount: totalAmount,
        shipping_address: address,
        status: "processing",
      },
      {
        transaction: order_transaction,
      }
    );

    const orderProducts = cartItem.products.map((product) => {
      return {
        order_id: savedOrder.id,
        product_id: product.id,
        quantity: product.cart_products.quantity,
      };
    });

    const savedOrderProducts = await order_product.bulkCreate(orderProducts, {
      transaction: order_transaction,
    });

    const orderProductIDs = cartItem.products.map((product) => {
      return product.id;
    });

    const deleteCartProduct = await cart_products.destroy({
      where: {
        product_id: {
          [Op.in]: orderProductIDs,
        },
      },
    });

    await order_transaction.commit();

    return res.status(201).json({
      status: "success",
      message: "Order placed Successfully",
      data: { items: savedOrderProducts, id: savedOrder.id },
    });
  } catch (err) {
    console.log(err);

    await order_transaction.rollback();
    return res.status(500).json({
      status: "error",
      message: "something went wrong!",
    });
  }
};

const getOrders = async (req, res) => {
  try {
    let { userID } = req.body;

    let orderData = await order.findAll({
      where: {
        customer_id: userID,
      },
    });

    orderData = orderData.map((order) => {
      return {
        id: order.id,
        order_date: order.order_date,
        shipping_address: order.shipping_address,
        status: order.status,
        total_amount: order.total_amount,
      };
    });

    return res.status(201).json({
      status: "success",
      message: "Order fetched Successfully",
      data: orderData,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      status: "error",
      message: "something went wrong!",
    });
  }
};

const getOrderItems = async (req, res) => {
  try {
    const orderID = Number(req.params.id);
    let { userID } = req.body;

    const orderData = await order.findOne({
      where: {
        customer_id: userID,
        id: orderID,
      },
      raw: true,
    });

    if (orderData === null) {
      return res.status(403).json({
        status: "error",
        message: "order not found!",
      });
    }

    const getOrderProducts = await order.findAll({
      attributes: ["id"],
      include: [
        {
          model: products,
          attributes: ["id", "price", "name", "image_url"],
          through: { as: "order_product", attributes: ["quantity"] },
        },
      ],
      where: {
        id: orderID,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Order Products fetched Successfully",
      data: getOrderProducts[0].products,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      status: "error",
      message: "something went wrong!",
    });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status, orderID } = req.body;

    let update_status = await order.update(
      {
        status: status,
      },
      {
        where: {id:orderID},
      }
    );

    return res.status(200).json({
      status: "success",
      message: "order status updated successfully",
    });

  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "something went wrong!",
    });
  }
};

module.exports = { createOrder, getOrders, getOrderItems, updateStatus };
