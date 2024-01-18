import mongoose from 'mongoose'

const CommentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    file: { type: String },
    likesCount: { type: Number, default: 0 },
    likedBy: Array,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    replies: { type: Array, default: [] },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Comment', CommentSchema)
