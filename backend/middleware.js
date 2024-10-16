const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./config");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    res.status(403).json({
      message: "Invalid token",
    });
    return
  }
  const token = authHeader.split(" ")[1];
  try {
    const isValidToken = jwt.verify(token, JWT_SECRET);
    // console.log("Is valid Token", isValidToken);
    req.userId = isValidToken.userId;
    next();
  } catch (e) {
    res.status(403).json({
      message: "Invalid token",
    });
  }
};

module.exports = {
  authMiddleware,
};
