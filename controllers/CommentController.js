import CommentModel from "../models/Comment.js";
import PostModel from "../models/Post.js";

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const doc = new CommentModel({
      comment: req.body.comment,
      userId: req.body.userId,
      postId: postId,
    });
    let comment = await doc.save();
    comment = await comment.populate("userId");
    await PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { commentsCount: 1 },
      },
      {
        returnDocument: "after",
      }
    );
    res.json(comment);
  } catch (err) {
    res.status(500).json({
      message: "Не удалось добавить комментарий",
      error: err.message,
    });
  }
};

export const allComment = async (req, res) => {
  try {
    const comment = await CommentModel.find()
      .populate({ path: "userId", select: "fullName avatarUrl" })
      .exec();

    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json({
      message: "Не удалось получить посты",
    });
  }
};

export const getPostComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const comment = await CommentModel.find({ postId })
      .populate({ path: "userId", select: "fullName avatarUrl" })
      .exec();

    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json({
      message: "Не удалось получить комментрарии",
    });
  }
};
export const removeComments = async (req, res) => {
  try {
    const comment = await CommentModel.deleteMany();

    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json({
      message: "Не удалось удалить комментарии",
    });
  }
};
