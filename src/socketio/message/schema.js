import mongoose from 'mongoose';
const {Schema, model} = mongoose
const MessageSchema = new mongoose.Schema(
    {
    conversationId: {type: mongoose.Schema.Types.ObjectId,  ref:"conversation", required: true},
    sender: {type: mongoose.Schema.Types.ObjectId,  ref:"user", required: true},
    text: {type: String}
},
    {timestamps: true}
)

export default model("message", MessageSchema)