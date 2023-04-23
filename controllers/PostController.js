import PostModel from "../models/Post.js";

import { validationResult } from "express-validator";
export const create = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      user: req.userId,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
    });
    const post = await doc.save();
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось создать пост",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec();
    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить посты",
    });
  }
};

//* Поиск поста по id и увеличение значения viewsCount на 1
export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;
    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: "after",
      }
    )
      .then((doc) => res.json(doc))
      .catch((err) =>
        res.status(404).json({
          message: "Не такого поста",
        })
      );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не1 удалось получить пост",
    });
  }
};
export const remove = async (req, res) => {
  try {
    const posts = await PostModel.deleteMany();
    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось удалить посты",
    });
  }
};
