import express from "express";
import User from "../models/user";
import { getUserThumbnails , getThumbnailById } from "../controllers/User";
import protect from "../middlwears/auth";

const UserRouter=express.Router();


UserRouter.get('/thumbnails',protect,getUserThumbnails);
UserRouter.get('/thumbnail/:id',protect,getThumbnailById);


export default UserRouter;