const { category, Sequelize } = require("./../models/index");

const saveCategory = async (req, res) => {
  try {
    const { name, desc } = req.body;

    const newCategory = {
      name,
      desc,
    };

    let data = await category.create(newCategory);

    return res.status(201).json({
      status: "success",
      message: "Category created Successfully",
      data: data,
    });
  } catch (err) {
    return res.status(500).send({
      status: "error",
      message: "something went wrong!",
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, desc } = req.body;
    const ID = req.params.id;

    const updatedCategory = {
      name,
      desc,
    };

    let data = await category.update(updatedCategory, {
      where: {
        id: ID,
      },
    });

    if (data[0] === 0) {
      return res.status(401).json({
        status: "error",
        message: "Category Not found with this id!",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Category updated Successfully",
      data: data,
    });
  } catch (err) {
    return res.status(500).send({
      status: "error",
      message: "something went wrong!",
    });
  }
};

const getCategory = async (req, res) => {
  try {
    let data = await category.findAll({
      raw: true,
    });

    return res.status(200).json({
      status: "success",
      message: "Category fetched Successfully",
      data: data,
    });
  } catch (err) {
    return res.status(500).send({
      status: "error",
      message: "something went wrong!",
    });
  }
};

module.exports = { saveCategory, updateCategory, getCategory };
