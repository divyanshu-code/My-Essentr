import connectDB from "@/Config/Db";
import MessageModel from "@/Models/messageModel";
import OrderModel from "@/Models/orderModel";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await connectDB()

        const { roomId } = await request.json();

        let room = await OrderModel.findById(roomId) ;

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