import connectDB from '@/Config/Db';
import MessageModel from '@/Models/messageModel';
import OrderModel from '@/Models/orderModel';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        await connectDB();

        const { senderId, text, roomId, time } = await req.json();

        if (!senderId || !text || !roomId || !time) {
            return NextResponse.json({ error: 'Missing required fields' },{ status: 400 });
        }

        let chatroom = await OrderModel.findById(roomId);

        if(!chatroom){
             return NextResponse.json({ error: 'Chat room not found' },{ status: 404 });
        }

        const message = await MessageModel.create({
            senderId,
            text,
            roomId,
            time,
        });

        return NextResponse.json(
            { success: true, message },
            { status: 201 }
        );
    } catch (error) {
        console.log(error);
        
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}