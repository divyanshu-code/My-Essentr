import connectDB from '@/Config/Db';
import OrderModel from '@/Models/orderModel';
import Emiteventhandler from '@/Config/Emiteventhandler';
import { NextResponse } from 'next/server';
import MasterOrderModel from '@/Models/masterModel';

export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();
        const { userId, items, totalamount, paymentMethod, shippingAddress, changeOption, change, isPaid } = body;

        const masterOrder = await MasterOrderModel.create({
            user: userId,
            totalAmount: totalamount,
            paymentMethod,
            shippingAddress,
            changeOption,
            change,
            isPaid,
            childOrders: []
        });

        const childOrderIds = [];
        
        for (const vendorId in items) {
            const vendorItems = items[vendorId];
            const vendorTotal = vendorItems.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

            const childOrder = await OrderModel.create({
                user: userId,
                vendor: vendorId,
                items: vendorItems,
                totalamount: vendorTotal,
                paymentMethod,
                shippingAddress,
                parentOrder: masterOrder._id,
                status: "Pending",
                isPaid
            });
            childOrderIds.push(childOrder._id);
        }

        masterOrder.childOrders = childOrderIds;
        await masterOrder.save();

        await Emiteventhandler("newOrder", masterOrder); 

        return NextResponse.json({ success: true, masterOrderId: masterOrder._id }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
    }
}