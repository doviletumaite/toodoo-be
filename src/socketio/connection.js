// import roomModel from "./chat/schema.js"
import userModel from "../services/users/schema.js"

const onConnection = (io, socket) => {
    console.log("socket connected :] with that id -> " + socket.id)


    // socket.on("sendMessage", async ({ message, room }) => {

    //     await roomModel.findOneAndUpdate({ room },
    //         {
    //             $push: { chatHistory: message }
    //         })

    //     socket.broadcast.emit("message", message)

    // })

    
    socket.on("setRoom", async ({ room }) => {
    
        const onlineUsers = await userModel.find({})
        onlineUsers.push({ room })

        socket.join(room)

        socket.emit("loggedin")

        socket.broadcast.emit("newConnection")

    })
}

export default onConnection