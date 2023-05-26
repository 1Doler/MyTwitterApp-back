import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";

import {
  registerValidation,
  loginValidation,
  postCreateValidation,
  postUpdateValidation,
} from "./validations/index.js";

import { handleValidationError, checkAuth } from "./utils/index.js";

import { UserController, PostController } from "./controllers/index.js";

//* Подключение к БД MongoDB
mongoose
  .connect(
    "mongodb+srv://admin:pas123@blog.rqgtu1g.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("bd ok"))
  .catch((err) => console.log("err", err));

const app = express();

//* Парсинг входящих данных в json
app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: "*",
  })
);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.removeHeader("x-powered-by");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  next();
});

app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.get("/", (req, res) => {
  res.send("fsadfasdfas");
});

//? Запросы на авторизация
app.post(
  "/auth/login",
  loginValidation,
  handleValidationError,
  UserController.login
);
app.post(
  "/auth/register",
  registerValidation,
  handleValidationError,
  UserController.register
);
app.get("/auth/getprofile", checkAuth, UserController.getProfile);

//? Запросы к постам
app.get("/posts", PostController.getAll);
app.get("/posts/tags", PostController.getLastTags);
app.get("/posts/:id", PostController.getOne);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationError,
  PostController.create
);
app.delete("/posts", checkAuth, PostController.removeAll);
app.delete("/posts/:id", checkAuth, PostController.removeOne);
app.patch(
  "/posts/:id",
  checkAuth,
  postUpdateValidation,
  handleValidationError,
  PostController.update
);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server OK");
});
