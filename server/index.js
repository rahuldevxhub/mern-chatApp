import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import router from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoute.js";
import http from "http";
import { Server } from "socket.io";


dotenv.config();

const app = express();

const server = http.createServer(app);

//initialize socket.io

export const io = new Server(server, {
  cors: { origin: "*" },
});

// store online users 
export const userSocketMap = {};
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log('user connected', userId)

  if(userId) userSocketMap[userId] = socket.id;

  // all users
  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  socket.on('disconnect',()=> {
    console.log("user disconnected", userId);
    delete userSocketMap[userId];
    io.emit('getOnlineUsers', Object.keys(userSocketMap))
  })

})

app.use(express.json({ limit: "4mb" }));

app.use(cors());

app.use("/api/chatapp/user", router);

app.use("/api/chatapp/message", messageRouter);

connectDB();
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`your app is listning on ${PORT}`);
});
