import FbPost from "../models/post.models.js"
import FbUser from "../models/user.models.js"
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcrypt";
import fs from "fs";
import { decode } from "punycode";


const uploadImgToCloudinary = async (filePath) => {

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    })
    try {
        const uploadResult = await cloudinary.uploader.upload(filePath, {
          resource_type: "auto",
        });
        fs.unlinkSync(filePath);
        return uploadResult.secure_url;
      } catch (error) {
        fs.unlinkSync(filePath);
        return null;
      }
};


//create user posts
const postCreate = async (req,res)=>{
    const {content} = req.body;
    if(!content) return res.status(404).json({message : "Please enter a content"})
    if (!req.file) return res.status(400).json({ message: "Image is required" });
    const userId = req.user.id;
    const user = await FbUser.findById(userId)
    if(!user) return res.status(404).json({message : "User not found"})
        const imageUrl = await uploadImgToCloudinary(req.file.path);
    const newPost = await FbPost.create({
        content,
        createdBy : user.id,
        image: imageUrl
    })

    await user.updateOne({
        $push : {posts : newPost._id}
    })

    res.status(200).json({
        post : newPost,
        user :  await FbUser.findById(userId).populate("posts")
    })
    
}

//get single user posts
const singleUserPost = async (req,res)=>{
    const {id} = req.params;
    const user = await FbUser.findById(id).populate("posts")
    if(!user) return res.status(404).json({message : "User not found"})
    
    res.status(200).json({
        message : "post found",
        user
    })

}

// get all user post
// const getAllUserPost = async (req, res) => {
//     const page = parseInt(req.query.page) || 1; 
//     const limit = parseInt(req.query.limit) || 3; 

//     const skip = (page - 1) * limit;

//     try {
//         const posts = await FbPost.find({}).skip(skip).limit(limit);

//         if (!posts || posts.length === 0) {
//             return res.status(404).json({ message: "No posts found" });
//         }

//         res.status(200).json({
//             message: "All posts found",
//             posts,
//             length: posts.length,
//             page,
//             limit,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Server error" });
//     }
// }

const getAllUserPost = async (req, res) => {
    // Parse pagination parameters with defaults
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 3);
    const skip = (page - 1) * limit;

    try {
        // Fetch posts with pagination
        const posts = await FbPost.find({}).skip(skip).limit(limit);

        // Check if posts are empty
        if (!posts || posts.length === 0) {
            return res.status(200).json({ 
                message: "No posts found", 
                posts: [], 
                length: 0, 
                page, 
                limit 
            });
        }

        res.status(200).json({
            message: "All posts found",
            posts,
            length: posts.length,
            page,
            limit,
        });
    } catch (error) {
        console.error("Error fetching posts:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};



const deletePost = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const post = await FbPost.findByIdAndDelete(id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const user = await FbUser.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        console.log("User posts before update:", user.posts);

        user.posts.pull(id);
        await user.save();

        console.log("User posts after update:", user.posts);

        const updatedUser = await FbUser.findById(userId).populate("posts");


        res.status(200).json({
            message: "Post deleted successfully",
            data: updatedUser,
        });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


const editPost = async (req, res) => {
    const { id } = req.params; 
    const userId = req.user.id; 
    const { content } = req.body;
    

    const user = await FbUser.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

   
    const post = await FbPost.findByIdAndUpdate(
        { _id: id, createdBy: userId },  
        { content: content }, 
        { new: true } 
    );

    
    if (!post) return res.status(404).json({ message: "Post not found or does not belong to the user" });

    res.status(200).json({
        message: "Post updated successfully",
        data: post
    });
};




export {postCreate,singleUserPost,getAllUserPost,deletePost,editPost}