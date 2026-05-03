import connectDB from "@/Config/Db";
import MasterOrderModel from "@/Models/masterModel";
import { NextResponse } from "next/server";

export async function POST(req) {

    try {

        await connectDB();

        const { parentorder } = await req.json();

        if (!parentorder) {
            return NextResponse.json({ message: "Parent order id is required" }, { status: 400 })
        }

        const updatestatus = await MasterOrderModel.findByIdAndUpdate(
            parentorder,
            { orderstatus: "ready" },
            {
                new: true,
                runValidators: true            // Ensures "ready" is validated against your enum array
            }
        );

        if (!updatestatus) {
            return NextResponse.json({ message: "Parent order not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Order status updated successfully", order: updatestatus }, { status: 200 })
    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: `Internal Server Error ${err.message}` }, { status: 500 })
    }
}

