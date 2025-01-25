import mongoose from "mongoose";


const postSchema = new mongoose.Schema({
    content : {
        type : String,
        required : true
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'FbUser'
    },
    comments : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'FbComment'
    }],
    image : {
        type: String,
        required: [true, "image is required"]
    }
    }, 
    {
        timestamps : true
    }
)

export default mongoose.model("FbPost", postSchema)