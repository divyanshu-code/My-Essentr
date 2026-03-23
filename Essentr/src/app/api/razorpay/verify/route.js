import connectDB from "@/Config/Db";
import OrderModel from "@/Models/orderModel";
import MasterOrderModel from "@/Models/masterModel";
import Emiteventhandler from "@/Config/Emiteventhandler";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      items,           // grouped by vendorId (same as COD)
      totalamount,
      shippingAddress,
    } = body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    const masterOrder = await MasterOrderModel.create({
      user: userId,
      totalAmount: totalamount,
      paymentMethod: "razorpay",
      shippingAddress,
      isPaid: true,
      childOrders: []
    });

    const childOrderIds = [];
    const createdOrders = [];

    for (const vendorId in items) {
      const vendorItems = items[vendorId];
      const vendorTotal = vendorItems.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity, 0
      );

      const deliveryCharge = totalamount - vendorTotal ; 

      const childOrder = await OrderModel.create({
        user: userId,
        vendor: vendorId,
        items: vendorItems,
        totalamount: vendorTotal + deliveryCharge ,
        paymentMethod: "razorpay",
        shippingAddress,
        parentOrder: masterOrder._id,
        status: "Pending",
        isPaid: true,
        razorpayOrderId: razorpay_order_id,
      });

      childOrderIds.push(childOrder._id);
      createdOrders.push(childOrder);
    }

    masterOrder.childOrders = childOrderIds;
    await masterOrder.save();

    for (const order of createdOrders) {
      const populatedOrder = await OrderModel.findById(order._id)
        .populate("user")
        .populate({
          path: "parentOrder",
          populate: { path: "childOrders" },
        });

      await Emiteventhandler("newOrder", populatedOrder);
    }

    return NextResponse.json({ success: true, masterOrderId: masterOrder._id }, { status: 200 });

  } catch (error) {
    console.error("VERIFY_ERROR:", error);
    return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
  }
}