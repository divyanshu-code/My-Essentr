import connectDB from '@/Config/Db';
import OrderModel from '@/Models/orderModel';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
    try {

        await connectDB();

        const { orderid } = params;
        const { status } = await request.json();

        if (!orderid || !status) {
            return NextResponse.json(
                { error: 'Order ID and status are required' },
                { status: 400 }
            );
        }

        const order = await OrderModel.findById(orderid).populate("user")

        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 400 }
            );
        }

        order.status= status 

        let getalldelivery = [] ;

        if(status == "Out for delivery" && !order.assigned){
               
            
        }

    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update order status' },
            { status: 500 }
        );
    }
}