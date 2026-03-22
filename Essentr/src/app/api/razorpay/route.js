import connectDB from "@/Config/Db";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const instance = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { amount } = body;

    if (!amount) {
      return NextResponse.json({ error: "Amount is required" }, { status: 400 });
    }

    const options = {
      amount: amount * 100, // paise
      currency: "INR",
      receipt: "receipt_" + Math.random().toString(36).substring(7),
    };

    const razorpayOrder = await instance.orders.create(options);

    return NextResponse.json({ success: true, order: razorpayOrder }, { status: 200 });

  } catch (error) {
    console.log("RAZORPAY_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}