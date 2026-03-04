import { auth } from "@/auth";
import connectDB from "@/Config/Db";
import DeliveryassignModel from "@/Models/deliveryassignModel";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        
        await connectDB()
        const session = await auth() 
        const riderId = session?.user?.id;

        const assignments = await DeliveryassignModel.find({
            status: "broadcasted",
            broadCastedTo: { $in: [riderId] } 
        })
        .populate({
            path: 'masterOrderId',
            populate: {
                path: 'childOrders',
                model: 'Order',
                populate: {
                    path: 'vendor',
                    model: 'Vendor',
                    foreignField: 'userId',
                    localField: 'vendor',
                }
            }
        })
        .sort({ createdAt: -1 });

        return NextResponse.json(assignments);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}