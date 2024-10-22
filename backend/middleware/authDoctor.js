import jwt from "jsonwebtoken";

//doctor authentication middleware
const authDoctor = async (req, res, next) => {
  try {
    const { dtoken } = req.headers;
    if (!dtoken) {
      return res.json({ success: false, message: "not authorized" });
    }
    const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);
    req.body.docId = token_decode.id;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

export default authDoctor;
