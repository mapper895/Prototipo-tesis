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
    preferences: {
      type: Array,
      default: [],
    },
    reccomendation: {
      type: Array,
      default: [],
    },
    role: {
      type: String,
      enum: ["user", "creator", "admin"],
    },
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
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
