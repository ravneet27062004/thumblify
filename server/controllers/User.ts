import { Request, Response } from "express";

import Thumbnail from "../models/thumbnail";
//controllers to get all user thumbnails

export const getUserThumbnails=async(req:Request,res:Response)=>{
try{
const {userId}=req.session;
const thumbnails=await Thumbnail.find({userId}).sort({createdAt:-1});
res.json({thumbnails});

}catch(error:any){
console.log(error);
res.status(500).json({error:"Failed to fetch thumbnails"})
}
}

//controller to get single user thumbnail
export const getThumbnailById=async(req:Request,res:Response)=>{
try{
const {userId}=req.session;
const {id}=req.params;
const thumbnails=await Thumbnail.findOne({userId,_id:id});
res.json({thumbnails});

}catch(error){
console.log(error);
res.status(500).json({error:"Failed to fetch thumbnail"})
}
}