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


const app = express();

const whiteList = [process.env.FRONT_END_URL, "http://localhost:3000"];
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
app.use(cors(corsOptions));

app.use(express.json());

const PORT = process.env.PORT;

const server = http.createServer(app);
const io = new Server(server, { transports: ["websocket"] });

io.on("connection", (socket) => onConnection(io, socket));
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(notFoundHandler);
app.use(badRequestHandler);
app.use(genericErrorHandler);

passport.use("google", googleStrategy);
app.use(passport.initialize());
app.use("/user", userRouter)

mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  console.log("connected with MONGO");
  server.listen(PORT, () => {
    console.log(`server running well :] on port ${PORT}`);
    console.table(listEndpoints(app));
  });
});
