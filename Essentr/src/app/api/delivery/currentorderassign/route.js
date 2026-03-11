import { auth } from "@/auth";
import connectDB from "@/Config/Db";
import DeliveryassignModel from "@/Models/deliveryassignModel";
import MasterOrderModel from "@/Models/masterModel";
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
            model: OrderModel,
            populate: {
                path: "vendor",
                model: VendorModel,
                localField: 'vendor',   
                foreignField: 'userId',
                populate: {
                    path: "userId", 
                    model: UserModel
                }
            }
        }).populate({
            path: "masterOrderId",
            model: MasterOrderModel
        })
        

        if (!activeassignment) {
            return NextResponse.json({ active: false }, { status: 200 })
        }

        return NextResponse.json({ active: true, data: activeassignment }, { status: 200 })

    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}