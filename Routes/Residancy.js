import express from "express";
import {
  bookVisit,
  createResidancy,
  deleteProprty,
  getAllResidancies,
  getFilteredResidancy,
  getFiterResidancyByPrice,
  getResidancy,
  updateProperty,
} from "../Controller/Residancy.js";
import Athentication from "../Config/Athentication.js";
const router = express.Router();

router
  .get("/getallresidancies", getAllResidancies)
  .get("/:residancyId", getResidancy)
  .post("/create", Athentication, createResidancy)
  .get("/filter/:keyword", Athentication, getFilteredResidancy)
  .get("/filter/price/:price", Athentication, getFiterResidancyByPrice)
  .post("/bookResidancy/:residancyId", Athentication, bookVisit)
  .delete("/delete/:resId", Athentication, deleteProprty)
  .patch("/update/:resId", Athentication, updateProperty);

export default router;
