import { NextResponse } from 'next/server';
import connectDB from '@/Config/Db';
import ChatModel from '@/Models/chatroomModel';

export async function POST(req) {
    try {
        await connectDB()

        const { orderId, userId, deliveryBoyId } = await req.json();

        if (!orderId || !userId || !deliveryBoyId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        let chatroom = await ChatModel.findOne({ orderId });

        if (!chatroom) {
            chatroom = await ChatModel.create({
                orderId,
                userId,
                deliveryBoyId,
            });
        }

        return NextResponse.json(chatroom, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}