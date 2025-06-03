import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    searchHistory: {
      type: Array,
      default: [],
    },
    likedEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    searchHistory: {
      type: Array,
      default: [],
    },
    preferences: [
      {
        type: String,
      },
    ],
    recomendation: {
      type: Array,
      default: [],
    },
    onboarded: { type: Boolean, default: false },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    createdEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    feedbackGiven: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
