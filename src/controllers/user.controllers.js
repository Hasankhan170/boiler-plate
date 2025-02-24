import jwt from "jsonwebtoken";
import FbUser from "../models/user.models.js"
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcrypt";
import fs from "fs";
import { decode } from "punycode";
import nodemailer from "nodemailer"


const generateAccessToken = (user) => {
    return jwt.sign({ email: user.email, id: user._id}, process.env.ACCESS_TOKEN, { expiresIn: '6h' });
};


//generate refresh token
const generateRefreshToken = (user)=>{
    return jwt.sign({email:user.email},process.env.REFRESH_TOKEN,{
        expiresIn: '7d'
    })
}

// const uploadImgToCloudinary = async (filePath) => {

//     cloudinary.config({
//         cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//         api_key: process.env.CLOUDINARY_API_KEY,
//         api_secret: process.env.CLOUDINARY_API_SECRET
//     })
//     try {
//         const uploadResult = await cloudinary.uploader.upload(filePath, {
//           resource_type: "auto",
//         });
//         fs.unlinkSync(filePath);
//         return uploadResult.secure_url;
//       } catch (error) {
//         fs.unlinkSync(filePath);
//         return null;
//       }
// };


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'hasankhanali0316@gmail.com',
      pass: 'bmwu nozg dwqc upfz'
  }
});


const register = async(req,res)=>{
    const {name,email,cnic} = req.body;
    if(!name) return res.status(404).json({message : "Please enter a name"})       
    if(!email) return res.status(404).json({message : "Please enter a email"})        
    if(!cnic) return res.status(404).json({message : "Please enter a cnic"})


    const user = await FbUser.findOne({email: email})   
    if(user) return res.status(400).json({message : "Email already exists"})
      const randomPassword = Math.random().toString(36).slice(-8);

    // const imageUrl = await uploadImgToCloudinary(req.file.path)
    const userCreate = await FbUser.create({
        name,
        email,
        cnic,
        password: randomPassword,
        status: "Pending",
        // profileImage: imageUrl
    })

    const info = await transporter.sendMail({
      from: '"hasan khan" <hasankhanali0316@gmail.com>', // sender address
      to: email, 
      subject: "Your Account Password ✔", // Subject line
      text: `Your password is: ${randomPassword}`, // plain text body
      html: `<b>Your password is: ${randomPassword}</b>`, // HTML body
    });

    console.log("Password email sent:", info.messageId);
    


    res.status(200).json({
        message : "User created successfully",
        data: userCreate,
    })
}



// const login = async (req,res)=>{
//     const {email,password} = req.body;
//     if(!email) return res.status(404).json({message : "Please enter a email"})        
//     if(!password) return res.status(404).json({message : "Please enter a password"})

//     const user = await FbUser.findOne ({email:email})
//     if(!user) return res.status(404).json({message : "User not found"})
    
//     const isPassword = await bcrypt.compare(password, user.password)
//     if(!isPassword) return res.status(404).json({message : "password mismatch"})

//         const accessToken = generateAccessToken(user);
//         const refreshToken = generateRefreshToken(user);
//         res.cookie("refreshToken", refreshToken, {
//           http: true,
//           secure: false,
//           maxAge: 7 * 24 * 60 * 60 * 1000,
//         });
//         res.status(200).json({
//           message: "User logged in successfully",
//           data: user,
//           ACCESS_TOKEN: accessToken,
//         });
// }


const login = async (req, res) => {
    try {
      const { cnic, password  } = req.body;
  
      // Input validation
      if (!cnic)
        return res.status(400).json({ message: "Please enter an cnic" });
      if (!password)
        return res.status(400).json({ message: "Please enter a password " });
  
      // Find user
      const user = await FbUser.findOne({ cnic });
      if (!user) return res.status(404).json({ message: "User not found" });
  
      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid)
        return res.status(401).json({ message: "Invalid password" });
  
      // Generate tokens
      const accessToken = generateAccessToken(user); 
      const refreshToken = generateRefreshToken(user); 
  
      // Set refresh token cookie with appropriate settings
      res.cookie("refreshToken", refreshToken, {
        http: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
  
      // Send response
      res.status(200).json({
        message: "User logged in successfully",
        accessToken,
       user: {
        id: user._id,
        cnic: user.cnic,
        email: user.email,
        name: user.name,
      },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };





const logout = async (req,res)=>{
    res.clearCookie('refresh')
    res.status(200).json({message : "User logged out successfully"})
}

const refreshToken = async (req,res)=>{
    const refresh= req.cookies.refresh || req.body.refresh
    if(!refresh) return res.status(401).json({message : "No refresh token found"})
    const decoded = jwt.verify(refresh,process.env.REFRESH_TOKEN)
    const user = await FbUser.findOne({email : decoded.email})
    if(!user) return res.status(403).json({message : "Invalid refresh token"})
    const access = generateAccessToken(user)
    res.status(200).json(
        {
         message: "access token generate",
         accessToken: access,
         user : decoded
        })
}





export {register,login,logout,refreshToken}