import * as sendMessageEvent from "./sendMessage.js";
import roomModel from "../socketio/rooms/schema.js"

const onConnection = (io, socket) => {
    console.log("socket connected :] with that id -> " + socket.id)


    socket.on("sendMessage", async ({ message, room }) => {

        await roomModel.findOneAndUpdate({ room },
            {
                $push: { chatHistory: message }
            })

        socket.broadcast.emit("message", message)

    })
}

export default onConnection