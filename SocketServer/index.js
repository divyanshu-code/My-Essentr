import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.NEXT_BASE_URL || "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

// to receive the info Socket.on 
// to send request or info io.emit 

io.on("connection", (socket) => {

    socket.on("joinVendorRoom", (vendorId) => {
        socket.join(vendorId); 
        console.log(`Vendor ${vendorId} joined their private room.`);
    });

    socket.on("userId", async (userId) => {

        console.log(`User registered: ${userId} -> Socket: ${socket.id}`);

        await fetch(`${process.env.NEXT_BASE_URL}/api/socket/connect`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, socketId: socket.id }),
        });

    })

    socket.on("updateLocation", ({ userId, latitude, longitude }) => {

        const location = {
            type: "Point",
            coordinates: [longitude, latitude],
        }
        fetch(`${process.env.NEXT_BASE_URL}/api/socket/update-location`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, location }),
        });

    })

    socket.on("disconnect", () => {
        console.log("User disconnected. Socket ID:", socket.id);
    });
});

app.post("/notify" , (req , res)=>{

   const { event, data , target } = req.body;
   
    if (target) {
        io.to(target).emit(event, data);
    } else if (data && data.vendor) {
        io.to(data.vendor).emit(event, data);
    } else {
       
        io.emit(event, data);
    }

    return res.status(200).json({ success: true });
})

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Socket server is running on http://localhost:${PORT}`);
});
