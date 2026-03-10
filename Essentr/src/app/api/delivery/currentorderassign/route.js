import { auth } from "@/auth";
import connectDB from "@/Config/Db";
import DeliveryassignModel from "@/Models/deliveryassignModel";
import OrderModel from "@/Models/orderModel";
import UserModel from "@/Models/userModel";
import VendorModel from "@/Models/vendorModel";
import { NextResponse } from "next/server";

export async function GET() {

    try {

        await connectDB()

        const session = await auth();

        const deliveryboyId = session?.user?.id

        const activeassignment = await DeliveryassignModel.findOne({ assignCastedTo: deliveryboyId, status: "assigned" }).populate({
            path: "currentOrderId",
            model: "Order",
            populate: {
                path: "vendor",
                model: 'Vendor',
                foreignField: 'userId',
                localField: 'vendor',
                populate: {
                    path: "userId",
                    model: 'User'
                }
            }
        })
            .populate("masterOrderId")
            .lean();

        if (!activeassignment) {
            return NextResponse.json({ active: false }, { status: 200 })
        }

        return NextResponse.json({ active: true, data: activeassignment }, { status: 200 })

    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}