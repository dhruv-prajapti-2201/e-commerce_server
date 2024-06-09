const { customers,cart, Sequelize } = require("./../models/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const isEmailExits = await customers.findOne({
      where: {
        email: email,
      },
      raw: true,
    });

    if (isEmailExits !== null) {
      return res.status(400).send({
        status: "error",
        message: "email is already exists!",
      });
    }

    const isPhoneExits = await customers.findOne({
      where: {
        phone: phone,
      },
      raw: true,
    });

    if (isPhoneExits !== null) {
      return res.status(400).send({
        status: "error",
        message: "phone number is already exists!",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      phone,
      password: hashPassword,
    };

    let data = await customers.create(newUser);
    delete newUser.password;

    let cartData=await cart.create({
      customer_id:data.id
    });

    return res.status(201).json({
      status: "success",
      message: "User registered Successfully",
      data: newUser,
    });
  } catch (err) {
    return res.status(500).send({
      status: "error",
      message: "something went wrong!",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userData = await customers.findOne({
      where: {
        email: email,
      },
      raw: true,
    });

    if (userData === null) {
      return res.status(400).send({
        status: "error",
        message: "don't have an account with this email!",
      });
    }

    const isValidUser = await bcrypt.compare(password, userData.password);

    if (!isValidUser) {
      return res.status(401).send({
        status: "error",
        message: "email or password is incorrect!",
      });
    }

    const token = jwt.sign({ userID: userData.id }, process.env.TOKEN_KEY);

    return res.status(200).json({
      status: "success",
      message: "Login Successfully",
      data: {
        token,
        name:userData.name,
        email:userData.email,
        phone:userData.phone,
        id:userData.id
      },
    });
    
  } catch (err) {
    return res.status(500).send({
      status: "error",
      message: "something went wrong!",
    });
  }
};

module.exports = { registerUser, loginUser };
