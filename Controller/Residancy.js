import Residancy from "../Model/Residancy.js";
import asyncHandler from "express-async-handler";
import User from "../Model/User.js";
import { sendEmail } from "../Config/Email.js";
import {
  bookingSusccesfullEmail,
  sendEmailToOwner,
} from "../Config/EmailTemplate.js";
export const getFilteredResidancy = asyncHandler(async (req, res) => {
  try {
    const { keyword } = req.params;
    const allFiltRes = await Residancy.find({
      title: { $regex: `^${keyword}`, $options: "i" },
    });
    res.status(200).json(allFiltRes);
  } catch (error) {
    throw new Error({ message: error.message });
  }
});
export const createResidancy = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    const {
      title,
      description,
      price,
      address,
      city,
      country,
      image,
      facilities,
      email,
      phone,
    } = req.body;
    const validPlace = await Residancy.findOne({ address: address });

    if (validPlace === null) {
      const newResidancy = await new Residancy({
        title: title,
        description: description,
        price: price,
        address: address,
        city: city,
        country: country,
        image: image,
        facilities: facilities,
        userEmail: email,
        userPhone: phone,
        owner: _id,
      });
      newResidancy.save();

      const addResToUserAcc = await User.findByIdAndUpdate(_id, {
        $push: { ownedResidancies: newResidancy._id },
      });

      res.status(201).json(newResidancy);
    } else {
      res
        .status(400)
        .json({ message: "A residancy with this address already there !" });
    }
  } catch (error) {
    console.log(error);
  }
});

export const getAllResidancies = asyncHandler(async (req, res) => {
  try {
    const allResidancies = await Residancy.find().sort({
      createdAt: 1,
    });
    res.status(201).json(allResidancies);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
export const getResidancy = asyncHandler(async (req, res) => {
  try {
    const { residancyId } = req.params;
    const residancy = await Residancy.findById(residancyId);
    res.status(200).json(residancy);
  } catch (error) {
    throw new Error({ message: error.message });
  }
});

export const bookVisit = asyncHandler(async (req, res) => {
  try {
    const { residancyId } = req.params;
    const { from, email, phone, duration } = req.body;
    const { _id } = req.user;

    const user = await User.findById(_id);

    const alredayBookedByUser = await user.bookedVisits.filter(
      ({ residancy }) => residancy._id.toString() === residancyId.toString()
    );

    if (alredayBookedByUser.length > 0) {
      res.status(400).json({
        message: "This residancy is already booked by you previously !",
      });
    } else {
      const today = new Date();
      const bookedDate =
        today.getDate() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getFullYear();
      const property = await Residancy.findById(residancyId);
      const bookResidancy = await User.findByIdAndUpdate(
        user._id,
        {
          $push: {
            bookedVisits: {
              residancy: property,
              bookingDate: bookedDate,
              duration: duration,
              phone: phone,
              email: email,
              from: from,
              resId: residancyId,
            },
          },
        },
        { new: true }
      );
      const ownerHtml = await sendEmailToOwner(property, req.body);

      const responseOwner = await sendEmail({
        to: property.userEmail,
        subject: "You got new client !",
        html: ownerHtml,
      });
      const subject = "A rasidency has succesfully booked for you ! ";
      const buyerHtml = await bookingSusccesfullEmail(user.name);
      const responseBuyer = await sendEmail({
        to: user.email,
        subject: subject,
        html: buyerHtml,
      });

      res.status(201).json(bookResidancy);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export const deleteProprty = asyncHandler(async (req, res) => {
  try {
    const { resId } = req.params;

    const deleteRes = await Residancy.findByIdAndDelete(resId);
    res.status(200).json({ message: "Successfully deleted !" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export const updateProperty = asyncHandler(async (req, res) => {
  try {
    const { resId } = req.params;
    const { _id } = req.user;
    const {
      title,
      description,
      price,
      address,
      city,
      country,
      image,
      facilities,
      email,
      phone,
    } = req.body;
    const property = await Residancy.findByIdAndUpdate(
      resId,
      {
        title: title,
        description: description,
        price: price,
        address: address,
        city: city,
        country: country,
        image: image,
        facilities: facilities,
        userEmail: email,
        userPhone: phone,
        owner: _id,
      },
      { new: true }
    );

    res.status(201).json(property);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export const getFiterResidancyByPrice = asyncHandler(async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.body;

    const filterProperties = await Residancy.find({
      price: { $lte: maxPrice, $gte: minPrice },
      /*  price: { $gte: minPrice }, */
    });

    res.status(200).json(filterProperties);
  } catch (error) {
    res.status(400).json(error.message);
  }
});
