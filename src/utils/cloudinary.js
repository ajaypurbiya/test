import {v2 as cloudinary } from "cloudinary"
import fs from "fs"


cloudinary.config({ 
  cloud_name: 'dprva0qhv', 
  api_key: '524539543735499',   
  api_secret: 'ZJOuBbi6PIu01e2zt0GYOFmdAtg'
});

const uploadOnCloudinary = async (localFilePath) => {
  try{
    if(!localFilePath) return null
    // upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    })
    // file has been uploaded successfull
    console.log("fill is uploaded on cloudinary", respose.url);
    return response;
  } catch (error){
    fs.unlinkSync(localFilePath) //remove the locally saved temporary files as the upload operation got failed
    return null;
  }
}

export { uploadOnCloudinary }


