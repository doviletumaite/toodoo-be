import mongoose from 'mongoose';
const {Schema, model} = mongoose
const ConversationSchema = new mongoose.Schema({
    members: {type: Array},
},
    {timestamps: true}
)

export default model("conversation", ConversationSchema)