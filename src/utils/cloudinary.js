import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

// Configuration
cloudinary.config({ 
  cloud_name:  "dprva0qhv", 
  api_key: "524539543735499", 
  api_secret: "ZJOuBbi6PIu01e2zt0GYOFmdAtg" // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // upload file to cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "auto" });
    // file has been uploaded
    // console.log("File uploaded to cloudinary", response.url);
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);  // remove file from local storage 
    }
    return response;
  } catch (error) {
    console.error("Error uploading to cloudinary:", error.message);
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    } // remove file from local storage if cloudinary upload fails
    return null;
  }
};

export { uploadOnCloudinary }