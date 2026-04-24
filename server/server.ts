import "dotenv/config";
import express, { Request, Response } from 'express';
import cors from "cors";
import session from "express-session";
import connectDB from "./configs/db";
import MongoStore from "connect-mongo";
import AuthRouter from "./routes/AuthRoutes";
import ThumbnailRouter from "./routes/ThumbnailRoutes";
import UserRouter from "./routes/UserRouter";
declare module "express-session" {
    interface SessionData {
        isLoogedIn: boolean;
        userId: string;
    }
}
const startServer = async () => {
  try {
    await connectDB();  // ✅ wait for DB

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });

  } catch (error) {
    console.log("DB connection failed:", error);
  }
};

startServer();
const app = express()

// Middleware
app.use(cors({
    origin:['http://localhost:5173', 'https://localhost:3000',"https://thumblify-nu.vercel.app"],
    credentials: true
}))
app.use(session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false, 
    cookie:{maxAge: 1000 * 60 * 60 * 24*7} ,// 7 day
    store:MongoStore.create({
        mongoUrl: process.env.MONGO_URI as string,
         collectionName: "sessions"
    })
       

}))
app.use(express.json());

const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});
app.use('/api/auth',AuthRouter);
app.use('/api/thumbnail',ThumbnailRouter);
app.use('/api/user',UserRouter);