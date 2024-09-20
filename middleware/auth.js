var jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const token = req.body.token || req.query.token;
    if (token) {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decoded;
    } else {
      return res.status(403).send("A token is required for authentication");
    }
  } catch (error) {
    return res.status(401).send("Token expired");
  }
  return next();
};

module.exports = verifyToken;
