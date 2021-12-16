import mongoose from 'mongoose';
const {Schema, model} = mongoose
const MessageSchema = new mongoose.Schema({
    text: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref:"user"},
    timestamp: { type: Number },
    id: { type: String },
})

const RoomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    chatHistory: {
        type: [MessageSchema],
        required: true,
        default: []
    }
})
export default model("room", RoomSchema)