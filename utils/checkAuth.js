import jwt from "jsonwebtoken";

export default (req, res, next) => {
  const token = (req.headers.cookie || "").replace(/token=\s?/, "");
  if (!token) {
    return res.status(403).json({
      message: "Нет доступа",
    });
  }

  try {
    const decoded = jwt.verify(token, "status");
    req.userId = decoded._id;
    next();
  } catch (err) {
    return res.status(403).json({
      message: "Нет доступа",
    });
  }
};
