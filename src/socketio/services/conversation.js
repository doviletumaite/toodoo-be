import {Router} from "express"
import userModel from "../../../src/services/users/schema.js"
import roomModel from "../rooms/schema.js"
const socketRoute = Router()

socketRoute.get('/usersOnline', async (req, res) => {
    const usersOnline = await userModel.find({})
    res.send({ usersOnline })
    socket.on("logIn", ({ username, room }) => {
 
        onlineUsers.push({ username, id: socket.id, room })

        socket.join(room)

        socket.emit("loggedin")

        socket.broadcast.emit("newConnection")

    })
})
socketRoute.get('/chat/:room', async (req, res) => {
    const room = await roomModel.findOne({ name: req.params.room })

    if (!room) {
        res.status(404).send()
        return
    }

    res.send(room.chatHistory)
})

export default socketRoute