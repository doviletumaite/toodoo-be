import mongoose from "mongoose";
import userSchema from "../users/schema.js"
import user from "../users/schema.js"

const {Schema, model} = mongoose

const commentSchema = new Schema(
    {
    comment: {type: String},
    user: {type: mongoose.Schema.Types.ObjectId, ref:"user"},
    postId: {type: mongoose.Schema.Types.ObjectId, ref:"post"}
    },
    
    { 
        timestamps: true
    }
)

const postSchema = new Schema({
    text: {type: String},
    picture: {type: String},
    user: {type: mongoose.Schema.Types.ObjectId,  ref:"user", required: true},
    comments: {default: [], type: [commentSchema]}
},
  
{ 
    timestamps: true
}
)


postSchema.static("findPostWithComments", async function (mongoQuery) {
    const total = await this.countDocuments(mongoQuery.criteria)
    const posts = await this.find(mongoQuery.criteria, mongoQuery.options.fields)
    .limit(mongoQuery.options.limit || 10)
    .skip(mongoQuery.options.skip)
    .sort(mongoQuery.options.sort)
    .populate({ path: "comments", select: "comment" })
    return {total, posts}
} )

export default model("post", postSchema)