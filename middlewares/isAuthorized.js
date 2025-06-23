const jwt = require("jsonwebtoken");

const isAuthorized = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1];
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.auth = decoded;
    next();
  } catch (e) {
    //if an error occured return request unauthorized error
    return res.status(401).json({
      message: "Unauthorized user",
    });
  }
};

module.exports = isAuthorized;
