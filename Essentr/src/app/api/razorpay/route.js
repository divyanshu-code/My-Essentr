import connectDB from "@/Config/Db";
import OrderModel from "@/Models/orderModel";
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
    const { amount, userId, items, totalamount, paymentMethod, shippingAddress, changeOption, change } = body;

    if (!userId || !Array.isArray(items) || !totalamount || !shippingAddress) {
      return NextResponse.json({ error: 'Missing core order data' }, { status: 400 });
    }

    const options = {
      amount: amount * 100,                            // paise
      currency: "INR",
      receipt: "receipt_" + Math.random().toString(36).substring(7),
    };
    const razorpayOrder = await instance.orders.create(options);

    const newOrder = await OrderModel.create({
      user: userId,
      items,
      totalamount,
      paymentMethod,
      shippingAddress,
      status: "Pending",
      changeOption: changeOption || "none",
      return: change || 0,
      razorpayOrderId: razorpayOrder.id,
      isPaid: false,
    });

    return NextResponse.json({
      ...razorpayOrder,
      dbOrderId: newOrder._id
    });

  } catch (error) {
    console.log("RAZORPAY_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}