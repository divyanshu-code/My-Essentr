import connectDB from '@/Config/Db';
import OrderModel from '@/Models/orderModel';
import { NextResponse } from 'next/server';

export async function GET(req ,{ params }) {

    try {

        await connectDB() ;

        const resolvedParams = await params;
        const { orderid } = resolvedParams;

        if (!orderid) {
            return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
        }

        const order = await OrderModel.findById(orderid).populate("assignedDeliverypartner");

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json(order, { status: 200 });

    } catch (err) {
         console.log(err);
         
         return NextResponse.json({ error: 'error in fetching order' }, { status: 500 });
    }
}