import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

// const URI = "mongodb+srv://ajaypupurbiya:Ajay123@ajay.ir85h.mongodb.net/sample"

const connectDB = async() => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.URI}/${DB_NAME}`)
    console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("MONGODB connection error ", error);
    process.exit(1)
  }
}


export default connectDB