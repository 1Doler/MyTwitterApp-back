import PostModel from "../models/Post.js";

export const create = async (req, res) => {
  try {
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
      .populate("user")
      .exec()
      .then((doc) => res.json(doc))
      .catch((err) => {
        console.log(err);

        res.status(404).json({
          message: "Не такого поста",
        });
      });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Не1 удалось получить пост",
    });
  }
};
export const removeAll = async (req, res) => {
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
export const removeOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findByIdAndDelete(postId).then((doc) => {
      if (!doc) {
        return res.status(404).json({
          message: "Статья не найдена",
        });
      }

      return res.json({ success: true });
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Не удалось удалить пост",
    });
  }
};
export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.findByIdAndUpdate(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
      }
    );

    res.send({
      success: true,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Не удалось изменить статью",
    });
  }
};
