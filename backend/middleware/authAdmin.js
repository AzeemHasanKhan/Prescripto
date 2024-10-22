import jwt from "jsonwebtoken";

//admin authentication middleware
const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers;
    if (!atoken) {
      return res.json({ success: false, message: "not authorized" });
    }
    const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);
    if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res.json({ success: false, message: "not authorized" });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

export default authAdmin;