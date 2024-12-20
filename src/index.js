// require('dotenv').config({path: './env'})
import * as dotenv from "dotenv";
dotenv.config();
import connectDB from "./db/index.js";
import { app } from "./app.js";


// dotenv.config({
  // path: './.env'   *- this is not work in my system ther is a one mistek is it .-*
// })

connectDB()
.then(() => {
  app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running at port : ${process.env.PORT}`);
    
  })
})
.catch((err) =>{
  console.log("MONGO db connection failed !!! ", err);
})





/*
import express from "express"
const app = express()

( async () => {
  try{
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    app.on("error", () => {
      console.log("ERRR:", error);
      throw error
    })
    app.listen(process.env.PORT, () =>{
      console.log(`App is listening on port ${process.env.PORT}`);
    })
  } catch(error){
    console.log("ERROR: ", error);
    throw err
  }
})()

*/