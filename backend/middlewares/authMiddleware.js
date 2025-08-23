const jwt = require("jsonwebtoken");
const Users = require("../models/user_model");

const checkUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // أو req.cookies.token
    if (!token) return res.status(401).json({ msg: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;

    const user = await Users.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: "Invalid token" });
  }
};

module.exports = { checkUser };
