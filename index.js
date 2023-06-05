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

import {
  UserController,
  PostController,
  CommentController,
} from "./controllers/index.js";

//* Подключение к БД MongoDB
mongoose
  .connect(
    "mongodb+srv://admin:pas123@blog.rqgtu1g.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("bd ok"))
  .catch(err => console.log("err", err));

const app = express();

//* Парсинг входящих данных в json
app.use(express.json());

app.use("/uploads", express.static("uploads"));
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    process.env.ORIGIN_URL || "https://blog-front-apks86jlt-1doler.vercel.app"
  );
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(
  cors({
    origin:
      process.env.ORIGIN_URL ||
      "https://blog-front-apks86jlt-1doler.vercel.app",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

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
  cors(),
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
app.patch("/auth/update", checkAuth, UserController.updateProfile);

app.get("/comment", CommentController.allComment);
app.get("/comment/:id", CommentController.getPostComment);
app.post("/comment/:id", CommentController.addComment);
app.delete("/comment", CommentController.removeComments);

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
app.patch("/updateall", PostController.updateAll);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.listen(process.env.PORT || 4444, err => {
  if (err) {
    return console.log(err);
  }
  console.log("Server OK");
});
