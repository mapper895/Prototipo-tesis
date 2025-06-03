import mongoose from "mongoose";

const feedbackSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Referencia al usuario que dejó el feedback
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5, // Solo valores entre 1 y 5
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Feedback = mongoose.model("Feedback", feedbackSchema);
