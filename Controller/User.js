import User from "../Model/User.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import { generateJwtToken } from "../Config/GenerateToken.js";
import Residancy from "../Model/Residancy.js";
import jwt from "jsonwebtoken";

export const registerUser = asyncHandler(async (req, res) => {
  try {
    const { email, name, password } = req.body;
    const userAlreadyExists = await User.findOne({ email: email }).exec();
    if (!userAlreadyExists) {
      const date = new Date();
      const joinedYear = date.getFullYear();
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      const registerNewUser = await User.create({
        name: name,
        email: email,
        password: hashPassword,
        registerDate: joinedYear,
      });
      registerNewUser.save();
      res.status(201).json(registerNewUser);
    } else {
      res.status(400).json({ message: "user already exists !" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export const getUserAllCreatedProperties = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    const allProp = await Residancy.find({ owner: _id });
    res.status(200).json(allProp);
  } catch (error) {
    res.status(400).json(error);
  }
});

export const fetchUser = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;

    const user = await User.findById(_id);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export const getSingleUser = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select({ password: 0 });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export const updateUserProfileImage = asyncHandler(async (req, res) => {
  try {
    const { userImage, userId } = req.body;

    const existsUser = await User.findById(userId).select({ password: 0 });
    if (existsUser) {
      const updatedUser = await User.findByIdAndUpdate(
        existsUser._id,
        { image: userImage },
        { new: true }
      );

      res
        .status(201)
        .json({ mesage: "Your Image has been updated succesfully !" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export const userLogin = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email: email });
    if (user) {
      const jwtKey = process.env.JWT_SECRET_KEY;
      const comparePassword = await bcrypt.compare(password, user.password);

      if (comparePassword) {
        const token = await generateJwtToken(user._id);
        user["token"] = token;
        res.status(200).json(user);
      } else {
        res.status(400).json({ message: "Credentilas are wrong try again !" });
      }
    } else {
      res.status(404).json({ message: "User not found !" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export const getUserAllBookings = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id).select({
      bookedVisits: 1,
      _id: 0,
    });
    res.status(200).json(user.bookedVisits);
  } catch (error) {
    throw new Error({ message: error.message });
  }
});

export const cancelUserBookings = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.body;
    const { residancyId } = req.params;

    const cancelBooking = await User.findOneAndUpdate(
      { _id: userId },
      {
        $pull: { bookedVisits: { resId: residancyId } },
      },
      { new: true }
    );

    res.status(201).json(cancelBooking);
  } catch (error) {
    throw new Error({ message: error.message });
  }
});

export const addOrRemoveFavItem = asyncHandler(async (req, res) => {
  try {
    const { residancyId } = req.params;
    const { email } = req.body;

    const alredayExists = await User.findOne({ email: email });

    if (alredayExists.favResidancy.includes(residancyId)) {
      const removeFav = await User.findOneAndUpdate(
        { email: email },
        { $pull: { favResidancy: residancyId } },
        { new: true }
      );
      res.status(201).json(removeFav);
    } else {
      const addFav = await User.findOneAndUpdate(
        { email: email },
        { $push: { favResidancy: residancyId } },
        { new: true }
      );
      res.status(201).json(addFav);
    }
  } catch (error) {
    throw new Error({ message: error.message });
  }
});

export const getUserAllFav = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    const allUserFav = await User.findById(_id).select({
      favResidancy: 1,
      _id: 0,
    });

    let allFavRes = await Promise.all(
      allUserFav.favResidancy.map((resId, i) => Residancy.findById(resId))
    );

    res.status(200).json(allFavRes);
  } catch (error) {
    res.status({ message: error.message });
  }
});

export const updateUserInfo = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    const { phone, speaks, occupation, lives } = req.body;

    const update = await User.findByIdAndUpdate(
      _id,
      {
        phone: phone,
        speaks: speaks,
        occupation: occupation,
        lives: lives,
      },
      { new: true }
    );
    res.status(201).json(update);
  } catch (error) {
    res.status({ message: error.message });
  }
});
export const deleteUserAccount = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id);

    const deletAllUserRes = await Promise.all(
      user.ownedResidancies.map((resId) => Residancy.findByIdAndDelete(resId))
    );

    const deleteAcc = await User.findByIdAndDelete(_id);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
});

export const resetUserPassword = asyncHandler(async (req, res) => {
  try {
    const { email, newPassword, token } = req.body;
    console.log(email);
    const validUser = await User.findOne({ email: email });

    if (validUser) {
      const varificationWithJwt = await jwt.verify(
        token,
        process.env.JWT_SECRET_KEY
      );

      if (varificationWithJwt) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        const setNewPassword = await User.findOneAndUpdate(
          { email: varificationWithJwt.userEmail },
          {
            password: hashedPassword,
          },
          { new: true }
        );
        res.status(201).json(setNewPassword);
      } else {
        res.status(401).json("Not authorized !");
      }
    } else {
      res.status(401).json("Not authorized !");
    }
  } catch (error) {
    res.status(error.message);
  }
});

