import { auth } from '@/auth';
import connectDB from '@/Config/Db';
import DeliveryassignModel from '@/Models/deliveryassignModel';
import OrderModel from '@/Models/orderModel';
import UserModel from '@/Models/userModel';
import VendorModel from '@/Models/vendorModel';
import { NextResponse } from 'next/server';

export async function GET(request) {

  try {
   
    await connectDB()

    const session = await auth();

    if(!session){
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const assignments = await DeliveryassignModel.find({
       broadCastedTo : session?.user?.id,
    }).populate({
        path: 'currentOrderId',
        populate: {
            path: 'vendor',    // Order model mein jo vendor field hai (User ID)
            model: 'Vendor',   // Force Mongoose to look into Vendor collection
            foreignField: 'userId', // Vendor collection mein 'userId' field se match karo
            localField: 'vendor'    // Order collection ki 'vendor' ID se
        }
    })
    .populate("vendorId");

    return NextResponse.json(assignments, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

