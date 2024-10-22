import jwt from "jsonwebtoken";

//user authentication middleware
const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.json({ success: false, message: "not authorized" });
    }
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = token_decode.id

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

export default authUser;
