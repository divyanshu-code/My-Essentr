import connectDB from "@/Config/Db";
import MasterOrderModel from "@/Models/masterModel";
import { NextResponse } from "next/server";

export async function PUT(request) {

    try {

        await connectDB();

        const { orderId, status } = await request.json();

        if (!orderId || !status) {
            return NextResponse.json(
                { message: "Order not found" },
                { status: 404 }
            );
        }

        // Update the order status in the database

        const order = await MasterOrderModel.findByIdAndUpdate(
            orderId,
            { orderstatus: status },
            {
                new: true,
                runValidators: true
            }
        );

        if (!order) {
            return NextResponse.json(
                { message: "Order not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Order status updated successfully", order },
            { status: 200 }
        );
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            { message: `Internal Server Error ${err.message}` },
            { status: 500 }
        );
    }

}