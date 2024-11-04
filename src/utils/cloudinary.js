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
        // console.log("File is uploaded on cloudinary ",response.url);
        fs.unlinkSync(localFilePath); // delete the locally saved temporary file
        return response; // return the url
    } catch (error) {
        fs.unlinkSync(localFilePath); // delete the locally saved temporary file
        return null; // return null if there is an error
    }
}

const deleteFromCloudinary = async (publicId) => {
    try {
        if(!publicId) return null; // if the public id is not provided, return null
        // delete the file from cloudinary
        const response = await cloudinary.uploader.destroy(publicId);
        // file has been deleted successfully, return the response
        return response; // return the response
    } catch (error) {
        return null; // return null if there is an error
    }
}

export {uploadOnCloudinary, deleteFromCloudinary}; // export the functions