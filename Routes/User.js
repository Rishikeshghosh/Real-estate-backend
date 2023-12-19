import express from "express";
import {
  addOrRemoveFavItem,
  cancelUserBookings,
  deleteUserAccount,
  fetchUser,
  getSingleUser,
  getUserAllBookings,
  getUserAllCreatedProperties,
  getUserAllFav,
  registerUser,
  resetUserPassword,
  updateUserInfo,
  updateUserProfileImage,
  userLogin,
} from "../Controller/User.js";
import Athentication from "../Config/Athentication.js";
const router = express.Router();

router
  .get("/getuserallbookings", Athentication, getUserAllBookings)
  .get("/created/properties", Athentication, getUserAllCreatedProperties)
  .get("/getsingleuser/:userId", Athentication, getSingleUser)
  .get("/getuserallfav", Athentication, getUserAllFav)
  .get("/fetchuser/fromhome", Athentication, fetchUser)
  .post("/register", registerUser)
  .post("/login", userLogin)
  .patch("/cancelBooking/:residancyId", cancelUserBookings)
  .patch("/resetPassword", resetUserPassword)
  .patch("/addorremoveitem/:residancyId", addOrRemoveFavItem)
  .patch("/update/profile/image", Athentication, updateUserProfileImage)
  .patch("/update/profile/info", Athentication, updateUserInfo)
  .delete("/delete/account", Athentication, deleteUserAccount);

export default router;
