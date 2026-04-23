import { Request,Response,NextFunction } from "express";

const protect = (req: Request, res: Response, next: NextFunction) => {
    const  {isLoogedIn , userId} = req.session;
    if(!isLoogedIn || !userId){
        return res.status(401).json({message: "You are not logged in"});
    }
    next();

}
export default protect;