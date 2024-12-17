import {v2 as cloudnary} from "cloudnary"
import fs from "fs"


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,  
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
  try{
    if(!localFilePath) return null
    // upload the file on cloudinary
    await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    })
    // file has been uploaded successfull
    console.log("fill is uploaded on cloudinary", respose.url);
    return response
  } catch (error){
    fs.unlinkSync(localFilePath) //remove the locally saved temporary files as the upload operation got failed
    return null;
  }
}

export {uploadOnCloudinary}


