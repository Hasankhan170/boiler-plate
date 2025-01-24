import express from 'express'
import dotenv from "dotenv";
import connectDB from './src/db/index.js'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import userRouter from "./src/routes/user.route.js"
// import postRouter from "./src/routes/post.route.js"




dotenv.config()


const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())



app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/user",userRouter)
// app.use("/api/userPost",postRouter)



connectDB()
.then(()=>{
    app.listen(process.env.PORT, () => {
        console.log(`⚙️  Server is running at port : ${process.env.PORT}`);
      });
})
.catch((err)=>{
    console.log("MONGO DB connection failed !!! ", err);
})