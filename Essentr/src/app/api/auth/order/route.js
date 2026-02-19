import connectDB from '@/Config/Db';
import OrderModel from '@/Models/orderModel';
import UserModel from '@/Models/userModel';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {

        await connectDB();

        const body = await request.json();
        const { userId, items, totalamount, paymentMethod, shippingAddress, changeOption, change, isPaid } = body;

        if (!userId || !Array.isArray(items) || !totalamount || !paymentMethod || !shippingAddress) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const user = await UserModel.findById(userId);

        if (!user) {
            return NextResponse.json({ message: 'user not found' }, { status: 400 });
        }

        const ordersByVendor = items.reduce((acc, item) => {
            const vendorId = item.vendor; 
            if (!vendorId) {
                throw new Error(`Item ${item.name} is missing a vendor ID`);
            }
            if (!acc[vendorId]) {
                acc[vendorId] = [];
            }
            acc[vendorId].push(item);
            return acc;
        }, {});

        const orderPromises = Object.keys(ordersByVendor).map(async (vendorId) => {
            const vendorItems = ordersByVendor[vendorId];
    
            const vendorTotal = vendorItems.reduce((sum, item) => {
                return sum + (Number(item.price) * item.quantity);
            }, 0);

            return await OrderModel.create({
                user: userId,
                vendor: vendorId,  
                items: vendorItems,
                totalamount: vendorTotal, 
                paymentMethod,
                shippingAddress,
                changeOption,
                change,
                isPaid 
            });
        });

        const createdOrders = await Promise.all(orderPromises);

        return NextResponse.json({ success: true, createdOrders }, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
    }
}