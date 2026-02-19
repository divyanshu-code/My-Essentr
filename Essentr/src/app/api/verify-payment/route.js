import connectDB from "@/Config/Db";
import OrderModel from "@/Models/orderModel";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

    if (expectedSignature === razorpay_signature) {

        await connectDB();

        await OrderModel.findOneAndUpdate(
            { razorpayOrderId: razorpay_order_id },
            { isPaid: true }
        );
        return NextResponse.json({ success: true, message: "Payment verified" });
    } else {
        return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 400 });
    }
}