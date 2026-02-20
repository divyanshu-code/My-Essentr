import express from 'express'   
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config();

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.NEXT_BASE_URL || "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

// to receive the info Socket.on 
// to send request or info io.emit 

const userSocketMap = new Map();

io.on("connection", (socket) => {
    console.log("New connection established. Socket ID:", socket.id);

    // 1. ADD USER TO MAP
    // The client should emit this when a user logs in or connects
    // socket.on("addUser", (userId) => {
    //     if (userId) {
    //         userSocketMap.set(userId, socket.id);
    //         console.log(`User registered: ${userId} -> Socket: ${socket.id}`);

    //         // Optionally broadcast the list of online users
    //         io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
    //     }
    // });

    // // 2. REAL-TIME NOTIFICATION EVENT
    // socket.on("sendNotification", (data) => {
    //     const { senderId, receiverId, type, content } = data;

    //     // Find the receiver's socket ID
    //     const receiverSocketId = userSocketMap.get(receiverId);

    //     // If receiver is currently online (socket exists)
    //     if (receiverSocketId) {
    //         io.to(receiverSocketId).emit("getNotification", {
    //             senderId,
    //             type,       // e.g., "message", "like", "comment_reply"
    //             content,    // Any additional notification data
    //             isRead: false,
    //             createdAt: new Date().toISOString(),
    //         });
    //         console.log(`Notification sent from ${senderId} to ${receiverId}`);
    //     } else {
    //         console.log(`Notification not delivered. User ${receiverId} is offline.`);
    //         // Note: If you want to handle offline notifications, you could save them 
    //         // to a database here via an API request or direct DB connection.
    //     }
    // });

    socket.on("disconnect", () => {
        console.log("User disconnected. Socket ID:", socket.id);

        // Find and remove mapping
        // We reverse-lookup by socket ID since key is userId
        // for (const [userId, socketId] of userSocketMap.entries()) {
        //     if (socketId === socket.id) {
        //         userSocketMap.delete(userId);
        //         console.log(`User unregistered: ${userId}`);

        //         // Update online users list
        //         io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
        //         break;
        //     }
        // }
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Socket server is running on http://localhost:${PORT}`);
});
