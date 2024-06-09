const { seller, Sequelize } = require("./../models/index");

const saveSeller = async (req, res) => {
  try {
    const { name, email,phone } = req.body;

    const newSeller = {
        name, email,phone
    };

   
    let data = await seller.create(newSeller);

    return res.status(201).json({
      status: "success",
      message: "Seller added Successfully",
      data: data,
    });
  } catch (err) {
    
    
    return res.status(500).send({
      status: "error",
      message: "something went wrong!",
    });
  }
};

const updateSeller = async (req, res) => {
  try {
    const { name, email,phone } = req.body;
    const ID=req.params.id;

    const updatedSeller = {
        name, email,phone
    };

    let data = await seller.update(updatedSeller, {
      where: {
        id: ID,
      },
    });

    if (data[0] === 0) {
      return res.status(401).json({
        status: "error",
        message: "Seller Not found with this id!",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "seller updated Successfully",
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

const getSeller=async (req,res)=>{
    try {
       
    
        let data = await seller.findAll({
            raw:true
        });
    
        return res.status(200).json({
          status: "success",
          message: "Seller fetched Successfully",
          data: data,
        });
      } catch (err) {
        return res.status(500).send({
          status: "error",
          message: "something went wrong!",
        });
      }
}

module.exports = { saveSeller,updateSeller,getSeller };
