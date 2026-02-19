import { NextResponse } from 'next/server';
import connectDB from '@/Config/Db';
import { auth } from '@/auth';
import OrderModel from '@/Models/orderModel';

export async function GET(req) {
  try {
    await connectDB();

    const session = await auth();
    
    if (!session || session.user.role !== 'vendor') {
      return NextResponse.json({ error: "Unauthorized. Vendor access only." }, { status: 401 });
    }

    const vendorId = session.user.id;    

    const orders = await OrderModel.find({
      vendor:  vendorId 
    })
    .sort({ createdAt: -1 }) 
    .populate('user'); 

    return NextResponse.json(orders, { status: 200 });

  } catch (error) {
    console.error("Vendor Order API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}