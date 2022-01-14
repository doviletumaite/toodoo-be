import express from "express";
import listEndpoints from "express-list-endpoints";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import { Server } from "socket.io";
import {
  badRequestHandler,
  genericErrorHandler,
  notFoundHandler,
} from "./errorHandlers.js";
import userRouter from "./services/users/index.js";
import onConnection from "./socketio/connection.js";
import passport from "passport";
import googleStrategy from "./services/users/authentication/oauth.js";
import postRouter from "./services/posts/index.js";
import listRouter from "./services/lists/index.js";
import conversationRouter from "./socketio/conversation/index.js";
import messageRouter from "./socketio/message/index.js";
// import socketRoute from "./socketio/services/conversation.js";
// import authorizeSocket from "./services/users/authentication/authSocket.js";
import messageModel from "./socketio/message/schema.js"

const app = express();

const whiteList = ["http://localhost:3003", "http://localhost:3000", "http://localhost:3003/user/googleLogin", "https://toodoo-fe.vercel.app", "https://toodooapi.herokuapp.com" ];
const corsOptions = {
  origin: (origin, callback) => {

    if (whiteList.some((allowedUrl) => allowedUrl === origin)) {
      callback(null, true);
    } else {
      const error = new Error("Not allowed by cors!");
      error.status = 403;
      callback(error);
    }
  },
};
app.use(cors());

app.use(express.json());

const PORT = process.env.PORT;

const server = http.createServer(app);
const io = new Server(server, { transports: ["websocket", "polling"], cors: corsOptions });

// io.on("connection", (socket) => onConnection(io, socket));
app.use((req, res, next) => {
  req.io = io;
  next();
});
// io.use(authorizeSocket)

let users = []
const addUser = (userId, socketId) => {
  !users.some(user=>user.userId === userId) &&
  users.push({userId, socketId})
  console.log({users})
}
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId)
}
const getUser = (userId) => {
   return users.find(user=>user.userId == userId)
}
    io.on("connection", (socket) => {

      console.log("socket " ,socket.id ,", is connected")
        socket.on("addUser", userID => {
          addUser(userID, socket.id)
          io.emit("getUsers", users)
        })

        socket.on("sendMessage", async (payload) => {
          console.log(payload)
          const {sender, receiverId, text, conversationId} = payload
            const user =  getUser(receiverId)
             console.log("user",user)
             console.log("receiverId",receiverId)
            console.log({sender})
             
          io.to(user.socketId).emit("incoming-msg", 
            payload
            )
            console.log("text, conversationId",text, conversationId)
            console.log("user receiver",user)
         
            // try {
            //   const newMessage = new messageModel({sender,receiverId,  text, conversationId})
            //   await newMessage.save()
            //   console.log("newMessage",newMessage)
            // } catch (error) {
            //   console.log(error)
            // }
 
            
        })

        socket.on("disconnect", () => {
          console.log("somebody is busy")
          removeUser(socket.id)
          io.emit("getUsers", users)
        })
    })
    


app.use(notFoundHandler);
app.use(badRequestHandler);
app.use(genericErrorHandler);

passport.use("google", googleStrategy);
app.use(passport.initialize());
app.use("/user", userRouter)
app.use("/posts", postRouter)
app.use("/list", listRouter)
app.use("/conversation", conversationRouter)
app.use("/message", messageRouter)

mongoose.connect(process.env.MONGO_URL)

mongoose.connection.on("connected", () => {
  console.log("connected with MONGO");
  server.listen(PORT, () => {
    console.log(`server running well :] on port ${PORT}`);
    console.table(listEndpoints(app));
  });
});
