import mongoose from "mongoose";

const {Schema, model} = mongoose

const taskSchema = new Schema({
    task: {type: String},
    done: {type: Boolean}
})

const listSchema = new Schema({
    title: {type:String, required:true},
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: "user", required:true
    },
    tasks:{default: [], type:[taskSchema]}
},
    {
        timestamps: true
    }
)

export default model("list",listSchema)