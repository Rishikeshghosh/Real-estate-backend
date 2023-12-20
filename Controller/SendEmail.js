import asyncHandler from "express-async-handler";
import { sendEmail } from "../Config/Email.js";
import {
  generateJwtToken,
  generateResetPasswordJwtToken,
} from "../Config/GenerateToken.js";
import { forgotEmail } from "../Config/EmailTemplate.js";

import User from "../Model/User.js";

export const sendForogotPasswordEmail = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;

    const validUser = await User.findOne({ email: email });

    if (validUser) {
      console.log(validUser);
      const token = await generateResetPasswordJwtToken(validUser.email);

      const appnedToken = await User.findByIdAndUpdate(
        validUser._id,
        {
          resetPasswordToken: token,
        },
        { new: true }
      );

      const resetPageLink = `https://6582d74656d7340438d1a1a0--nimble-sfogliatella-157311.netlify.app/Reset-Password?token=${token}&email=${appnedToken.email}`;
      const subject = "Reset your password for Homyz";
      const html = await forgotEmail(resetPageLink); //`<p>Click <a href='${resetPageLink}'>here</a> to reset your password wuth Homyz </p>`;

      const response = await sendEmail({
        to: email,
        subject: subject,
        html: html,
      });

      res.status(200).json(response);
    } else {
      res.status(400).json({ message: "User not found with this email !" });
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});
