import express from "express";
import mongoose from "mongoose";

import { registerValidation, loginValidation } from "./validations/auth.js";
import { postCreateValidation } from "./validations/post.js";

import checkAuth from "./utils/checkAuth.js";

import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";

//* Подключение к БД MongoDB
mongoose
  .connect(
    "mongodb+srv://admin:pas123@blog.rqgtu1g.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("bd ok"))
  .catch((err) => console.log("err", err));

const app = express();

//* Парсинг входящих данных
app.use(express.json());

app.post("/auth/login", loginValidation, UserController.login);
app.post("/auth/register", registerValidation, UserController.register);
app.get("/auth/getprofile", checkAuth, UserController.getProfile);

app.post("/posts", checkAuth, postCreateValidation, PostController.create);
app.get("/posts", checkAuth, PostController.getAll);
app.get("/posts/:id", checkAuth, PostController.getOne);
app.delete("/posts", checkAuth, PostController.remove);
/* app.get("/posts/:id", PostController.getPost); */

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server OK");
});
