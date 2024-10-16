import { v2 as cloudinary } from 'cloudinary';
import { log } from 'console';
import fs from "fs";

cloudinary.config({ 
    cloud_name: process.env.ClOUDINARY_CLOUD_NAME, 
    api_key: process.env.ClOUDINARY_API_KEY, 
    api_secret: process.env.ClOUDINARY_API_SECRET
});


const uploadOnCloudinary = async (loacalFliePath) => {
    try {
        if(!loacalFliePath) return null;
        // upload on cloudinary
        const response = await cloudinary.uploader.upload(loacalFliePath,{
            resource_type : "auto"
        })
        //file success upload
        console.log("File uploaded to cloudinary",
            response.url);
        return response;
    } catch (error) {
        fs.unlinkSync(loacalFliePath) // remove the locally saved file as the upload opertion
        return null;
    }
}

export {uploadOnCloudinary }