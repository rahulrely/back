import { asyncHandler } from "../utils/asyncHandler.js" ;
import { ApiError } from "../utils/ApiError.js"
import { User } from '../models/user.model.js'
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler( async (req,res) => {
    const { fullName,email,username,password } = req.body
    console.log(email,username,);
    
    // if(fullName === ""){
    //     throw new ApiError(400,"full name must");
    // }
    if(
        [fullName,email,username,password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400,"All fields are required");
    }

    const existedUser =  await User.findOne({
        $or:[{ username },{ email }]
    })

    if(existedUser){
        throw new ApiError(409,"User already registered with email/username");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar File is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(400,"Avatar File is required");
    }

    const user = await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url  || "",
        email,
        password,
        username:username.toLowerCase()
    })
    
    const createdUserser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUserser){
        throw new ApiError(500,"wrong while registering user");
    }

    return res.status(201).json(
        new ApiResponse(200,createdUserser,"user registered successfully")
    )

})

export { registerUser}