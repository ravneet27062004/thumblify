//controlers for user registration

import { Request, Response } from 'express';
import User from '../models/user';
import bcrypt from 'bcrypt';
import { error } from 'node:console';
export const registerUser = async(req: Request, res: Response)=>{
try{
    const {name,email,password }=req.body;
    //find user by email

    const user  =await User.findOne({email});
if(user){
    return res.status(400).json({message: "User already exists"});
}
//encrypt password
const salt=await bcrypt.genSalt(10);
const hashedPassword=await bcrypt.hash(password, salt);
//create new user
const newUser = new User({
    name,
    email,
    password: hashedPassword
})
await newUser.save();

//setting user data in session
req.session.isLoogedIn=true;
req.session.userId=newUser._id.toString();
return res.json({
    message:"account created successfully",
    user:{
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
       
    }
})
} catch(error){
    console.error("Error in registerUser:", error);
    return res.status(500).json({message: "Server error"});
}}

//controller for user login
export const loginUser = async(req: Request, res: Response)=>{
    try{
const {email, password}=req.body;
//find user by email
const user = await User.findOne({email});
if(!user){
    return res.status(400).json({message: "Invalid credentials"});
}
//compare password
const isPasswordCorrect = await bcrypt.compare(password, user.password || "");
if(!isPasswordCorrect){
    return res.status(400).json({message: "Invalid credentials"});
}
//setting user data in session
req.session.isLoogedIn=true;
req.session.userId=user._id.toString();
return res.json({
    message:"Login successful",
    user:{
        _id: user._id,
        name: user.name,
        email: user.email,
    }
    })
    }catch(error){
   console.log(error);
   return res.status(500).json({message: "Server error"});
    }
}
//controller for user logout
export const logoutUser = (req: Request, res: Response)=>{
    req.session.destroy((err)=>{
        if(error){
            console.log(error);
            return res.status(500).json({message: "Server error"});
        }
    })
    return res.json({message: "Logout successful"});
}

//vontrollers for user verification

export const verifyUser = async(req: Request, res: Response)=>{
    try{
const {userId}=req.session;
const user = await User.findById(userId).select("-password");
if(!user){
    return res.status(401).json({message: "Unauthorized"});
}
return res.json({user});
    }catch(error){
console.log(error);
res.status(500).json({message: "Server error"});
    }
}
