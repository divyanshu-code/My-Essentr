import { NextResponse } from 'next/server';
import OrderModel from '@/Models/orderModel';
import { auth } from '@/auth';
import connectDB from '@/Config/Db';

export async function GET(req) {
    try {
        await connectDB();

        const session = await auth();

        // findOne() will give you only one data therefore use find() for whole data.

        const orders = await OrderModel.find({ user: session?.user?.id }).populate("user").sort({ createdAt: -1 });      

        if (!orders) {
            return NextResponse.json(
                { message: "Orders not found" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            orders,
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}