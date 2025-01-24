import express from 'express';
import { register,login,logout,refreshToken} from '../controllers/user.controllers.js';
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router()

router.post("/register", upload.single("profileImage"), register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refreshToken", refreshToken);




export default router;