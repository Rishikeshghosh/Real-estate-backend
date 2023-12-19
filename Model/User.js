import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-sEj1vTlm-cB5dRsBSLcPQ1U15LZ0sDz2yQ&usqp=CAU",
    },
    token: { type: String },
    registerDate: { type: String },
    phone: { type: String },
    speaks: { type: String },
    lives: { type: String },
    occupation: { type: String },
    favResidancy: { type: Array },
    bookedVisits: { type: Array },
    about: { type: String },
    ownedResidancies: { type: Array },
    resetPasswordToken: { type: String, default: "" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
