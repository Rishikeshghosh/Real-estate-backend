import nodemailer from "nodemailer";


export const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "rishikeshghoshghosh@gmail.com" /* process.env.EMAIL_PASSWORD */,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const info = await transporter.sendMail({
      from: '"Homyz" <foo@example.com>',
      to: to,
      subject: subject,
      html: html,
    });
  } catch (error) {
    console.log(error);
  }
};


 export const bookingSuccessfullEmail = () => {
  return (``)
 }