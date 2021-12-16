import {Router} from "express"
import userModel from "../../../src/services/users/schema.js"
const socketRoute = Router()

socketRoute.get('/usersOnline', async (req, res) => {
    const usersOnline = await userModel.find({})
    res.send({ usersOnline })
    socket.on("setUsername", ({ username, room }) => {
        // With this username:
        // we can now save the username in a list of online users

        onlineUsers.push({ username, id: socket.id, room })

        socket.join(room)

        // we can emit back a logged in message to the client
        socket.emit("loggedin")

        // we can emit an event to all other clients, i.e. excluding this one
        socket.broadcast.emit("newConnection")

        // this is how you emit an event to EVERY client, including this one
        //io.sockets.emit("someevent")
    })
})


export default socketRoute