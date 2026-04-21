import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 2,
      maxlength: 64,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 128,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 128,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
      maxlength: 32,
    },
    address: {
      type: String,
      default: "",
      trim: true,
      maxlength: 512,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true },
);

userSchema.set("toJSON", {
  virtuals: true,
  transform(_doc, ret) {
    ret.id = ret._id?.toString();
    delete ret._id;
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  },
});

export const User = mongoose.model("User", userSchema);
