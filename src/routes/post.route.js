import express from "express"
import { postCreate,singleUserPost,getAllUserPost,deletePost,editPost} from "../controllers/post.controllers.js"
import authenticateUser from "../middleware/auth.middleware.js"
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router()

router.post("/post", upload.single("image"),authenticateUser,postCreate)
router.get("/post/:id", authenticateUser,singleUserPost)
router.get("/post",getAllUserPost)
router.delete("/post/:id",authenticateUser,deletePost)
router.put("/post/:id",authenticateUser,editPost)






export default router;