import mongoose from "mongoose";

export const connectMongoDb = async () => {
  //"mongodb://127.0.0.1:27017/bookstore"
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`DATABASE CONNECTED ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error occured : ${error}`);
  }
};
