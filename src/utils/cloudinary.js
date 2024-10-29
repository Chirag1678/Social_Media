import {v2 as cloudinary} from "cloudinary"; // cloudinary module
import fs from "fs"; // file system module

cloudinary.config({ // configure cloudinary
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null; // if the local file path is not provided, return null
        // upload the file to cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto", // automatically detect the file type
        });
        // file has been uploaded successfully, return the url
        console.log("File is uploaded on cloudinary ",response.url);
        return response; // return the url
    } catch (error) {
        fs.unlinkSync(localFilePath); // delete the locally saved temporary file
        return null; // return null if there is an error
    }
}

export {uploadOnCloudinary};