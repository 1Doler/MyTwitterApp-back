import mongoose from "mongoose";

const CommentShema = mongoose.Schema(
  {
    comment: {
      type: String,
      require: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "User",
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "Post",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("CommentShema", CommentShema);
