import connectDB from "@/Config/Db";
import { connectToDatabase } from "@/lib/mongodb";
import ChatModel from "@/Models/chatroomModel";
import Message from "@/models/Message";
import MessageModel from "@/Models/messageModel";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await connectDB();

        const { roomId } = await request.json();

        let room = await ChatModel.findById(roomId) ;

        if (!room) {
            return NextResponse.json(
                { error: "Room not found" },
                { status: 404 }
            );
        }

        const messages = await MessageModel.find({ roomId : room._id});

        if (messages.length === 0) {
            return NextResponse.json(
                { error: "No messages found for this roomId" },
                { status: 404 }
            );
        }

        return NextResponse.json({ messages }, { status: 200 });
    } catch (error) {
        console.log(error);
        
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}