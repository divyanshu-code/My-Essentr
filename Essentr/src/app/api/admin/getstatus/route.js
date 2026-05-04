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

        const order = await MasterOrderModel.findById(parentorder);

        if (!order) {
            return NextResponse.json({ message: "Parent order not found" }, { status: 404 });
        }

        return NextResponse.json({ order }, { status: 200 });

    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: `Internal Server Error ${err.message}` }, { status: 500 })
    }

}