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
        const createdOrders = [];

        for (const vendorId in items) {
            const vendorItems = items[vendorId];
            const vendorTotal = vendorItems.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

            const deliveryCharge = totalamount - vendorTotal ;

            const childOrder = await OrderModel.create({
                user: userId,
                vendor: vendorId,
                items: vendorItems,
                totalamount: vendorTotal + deliveryCharge,
                paymentMethod,
                shippingAddress,
                parentOrder: masterOrder._id,
                status: "Pending",
                changeOption,
                change,
                isPaid
            });

            childOrderIds.push(childOrder._id);
            createdOrders.push(childOrder);

        }

        masterOrder.childOrders = childOrderIds;
        await masterOrder.save();

        for (const order of createdOrders) {
            
            const populatedOrder = await OrderModel.findById(order._id)
                .populate('user')
                .populate({
                    path: 'parentOrder',
                    populate: { path: 'childOrders' } 
                });

            await Emiteventhandler("newOrder", populatedOrder);
        }

        return NextResponse.json({ success: true, masterOrderId: masterOrder._id }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
    }
}