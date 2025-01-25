import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: { 
        type: String,
        default: null 
    },
    cnic : {
        type : Number,
        required : true
    },
    role: { 
        type: String,
        enum : ['user','admin'],
        default : "user",
        required : true

    }},{
        timestamps: true
    })

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10)
    next()
})

export default mongoose.model("FbUser",userSchema)