import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectMongoDb } from "./Config/ConnectDatabase.js";
import userRouter from "./Routes/User.js";
import residancyRouter from "./Routes/Residancy.js";
import emailRouter from "./Routes/Email.js";
import nodemailer from "nodemailer";
const server = express();
dotenv.config();
connectMongoDb();
server.use(cors());
server.use(express.json());

server.use("/api/user", userRouter);
server.use("/api/residancy", residancyRouter);
server.use("/api/email", emailRouter);

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server has started at port ${PORT}`);
});
