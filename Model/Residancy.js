import mongoose from "mongoose";
import { Schema } from "mongoose";

const residancySchema = new Schema(
  {
    title: { type: String },
    description: { type: String },
    price: { type: Number },
    address: { type: String, unique: true },
    city: { type: String },
    country: { type: String },
    image: { type: String },
    facilities: { type: Object },
    userEmail: { type: String },
    userPhone: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Residancy = mongoose.model("Residancy", residancySchema);
export default Residancy;
