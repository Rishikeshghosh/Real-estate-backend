import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../Model/User.js";
const Athentication = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);

      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});
export default Athentication;
