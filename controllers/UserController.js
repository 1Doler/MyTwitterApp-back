import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        message: "Неверный логин или пароль",
      });
    }

    //* Проверка пароля
    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );
    if (!isValidPassword) {
      return res.status(404).json({
        message: "Неверный логин или пароль",
      });
    }

    const token = jwt.sign({ _id: user._id }, "status", { expiresIn: "30d" });
    const { passwordHash, ...userData } = user._doc;
    res.status(400).json({
      message: "Вы успешно авторизовались",
      userData,
      token,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Не удалось авторизоваться",
    });
  }
};

export const register = async (req, res) => {
  try {
    //* Проверка на валидность
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    //* Шифрование пароля
    const { password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    //* Хранение данных пользователя
    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      passwordHash: hash,
      avatarUrl: req.body.avatarUrl,
    });

    //* Создание пользователя
    const user = await doc.save();

    //* Создание токена в которой будет храниться _id
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "status",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      userData,
      token,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Не удалось зарегистрироваться",
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(403).json({
        message: "Такого пользователя нет",
      });
    }

    const { passwordHash, ...userData } = user._doc;
    res.json({
      success: true,
      userData,
    });
  } catch (err) {
    res.status(500).json({
      message: "Вы не авторизованы",
    });
  }
};
