import jwt from "jsonwebtoken";

export default (req, res, next) => {
  console.log("res", res);
  console.log("req", req);
  const token = (req.headers.cookie || "").replace(/token=\s?/, "");
  if (!token) {
    return res.status(403).json({
      message: "Нет доступа, нет куков",
    });
  }

  try {
    const decoded = jwt.verify(token, "status");
    console.log("req.userId", req.userId);
    console.log("decoded._id", decoded._id);
    req.userId = decoded._id;
    next();
  } catch (err) {
    return res.status(403).json({
      message: "Нет доступа, cookie",
    });
  }
};
