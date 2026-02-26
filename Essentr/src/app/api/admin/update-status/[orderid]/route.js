import connectDB from '@/Config/Db';
import OrderModel from '@/Models/orderModel';
import UserModel from '@/Models/userModel';
import { NextResponse } from 'next/server';
import DeliveryassignModel from '@/Models/deliveryassignModel';
import Emiteventhandler from '@/Config/Emiteventhandler';

export async function POST(request, { params }) {
    try {

        await connectDB();

        const resolvedParams = await params;
        const { orderid } = resolvedParams;

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


        let deliverypartner = [];

        if (status == "Out for delivery" && !order.assigned) {

            const existingAssignment = await DeliveryassignModel.findOne({ currentOrderId: orderid });
            if (existingAssignment) {
                return NextResponse.json({ message: "Assignment already exists" }, { status: 200 });
            }

            const { latitude, longitude } = order.shippingAddress;

            const nearestDeliveryPartner = await UserModel.find({
                role: "delivery",
                location: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [Number(longitude), Number(latitude)]
                        },
                        $maxDistance: 10000   // 10 km 
                    }
                }
            })

            const nearByDeliveryPartner = nearestDeliveryPartner.map((b) => b._id.toString())
            const busyIds = await DeliveryassignModel.find({

                assignCastedTo: { $in: nearByDeliveryPartner },      // it will check nearByDeliveryPartner is assined or not.
                status: { $nin: ["broadcasted", "completed"] }

            }).distinct("assignCastedTo")

            // whole busyIds is array of delivery partner ids who are busy

            const busyIdSet = new Set(busyIds.map(id => id.toString()))

            const availableDeliveryPartnerObjects = nearestDeliveryPartner.filter((partner) =>
                !busyIdSet.has(partner._id.toString())
            );

            const candidates = availableDeliveryPartnerObjects.map((b) => b._id)

            if (candidates.length === 0) {
                await order.save();

                return NextResponse.json(
                    { error: 'No available delivery partners found' },
                    { status: 400 }
                );
            }

            const deliveryAssign = await DeliveryassignModel.create({
                currentOrderId: order._id,
                broadCastedTo: candidates,
                status: "broadcasted",
                vendorId: order.vendor?._id || order?.vendor,
            });

            order.status = status
            order.assigned = deliveryAssign._id;

            await deliveryAssign.populate({
                path: 'currentOrderId',
                populate: {
                    path: 'vendor',    // Order model mein jo vendor field hai (User ID)
                    model: 'Vendor',   // Force Mongoose to look into Vendor collection
                    foreignField: 'userId', // Vendor collection mein 'userId' field se match karo
                    localField: 'vendor'
                }
            });

            await deliveryAssign.populate('vendorId');

            for (const boyId of candidates) {
                const boy = await UserModel.findById(boyId)
                if (boy?.socketId) {
                    await Emiteventhandler("new-assignments", deliveryAssign, boy.socketId)
                }
            }


            deliverypartner = availableDeliveryPartnerObjects.map(b => ({
                id: b._id,
                name: b.name,
                mobile: b.mobile,
                latitude: b.location.coordinates[1],
                longitude: b.location.coordinates[0],
            }));
        } {

            order.status = status;
        }

        await order.save();
        await order.populate("user")
        await order.populate("vendor")

        await Emiteventhandler("order_status_updated", {
            orderId: order._id,
            status: order.status,
        })

        return NextResponse.json({
            success: true,
            assign: order.assigned?._id,
            availablePartners: deliverypartner
        }, { status: 200 })

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: 'Failed to update order status' },
            { status: 500 }
        );
    }
}