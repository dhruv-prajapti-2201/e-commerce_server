const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const user = req.headers.authorization.split(" ")[2];
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
    const userID = decodedToken.userID;

    if(Number(userID)!==Number(user)){
        throw new Error('invalid user! Access denied')
    }

    req.body.userID=userID

    next();

  } catch (err) {
    console.log(err);
    
    return res.status(403).send({
        status: "error",
        message: "Access denied!",
    });

  }
};

module.exports={auth};
