import { NextResponse } from 'next/server';
import connectDB from '@/Config/Db';
import { auth } from '@/auth';
import OrderModel from '@/Models/orderModel';
import MasterOrderModel from '@/Models/masterModel';

export async function GET(req) {
  try {
    await connectDB();

    const session = await auth();
    
    if (!session || session.user.role !== 'vendor') {
      return NextResponse.json({ error: "Unauthorized. Vendor access only." }, { status: 401 });
    }

    const vendorId = session.user.id;    

    const orders = await OrderModel.find({ vendor: vendorId })
      .sort({ createdAt: -1 }) 
      .populate('user assignedDeliverypartner')
      .populate({
        path: 'parentOrder',
        populate: { path: 'childOrders' } 
      });

    const processedOrders = orders.map(order => {
      const orderObj = order.toObject();
      const master = orderObj.parentOrder;

      if (master && master.childOrders) {
        const totalProductSubtotal = master.childOrders.reduce((sum, child) => sum + child.totalamount, 0);
        
        const totalDeliveryFee = master.totalAmount - totalProductSubtotal;

        const ratio = orderObj.totalamount / totalProductSubtotal;
        const vendorDeliveryShare = ratio * totalDeliveryFee;

        orderObj.deliverycharge = vendorDeliveryShare ;
        orderObj.vendorPayable = orderObj.totalamount + vendorDeliveryShare;
      } else {
        orderObj.vendorPayable = orderObj.totalamount;
      }
      return orderObj;
    });

    return NextResponse.json(processedOrders, { status: 200 });
  } catch (error) {
    console.error("Vendor Order API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}