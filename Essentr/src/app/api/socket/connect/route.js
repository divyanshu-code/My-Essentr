import { NextResponse } from 'next/server';
import connectDB from '@/Config/Db';
import UserModel from '@/Models/userModel';

export async function POST(request) {
    try {
        await connectDB();
        const { userId, socketId } = await request.json();

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                socketId,
                isAvailable: true,
            }, { new: true });

        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.log(error);
        
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
