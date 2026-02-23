import connectDB from '@/Config/Db';
import OrderModel from '@/Models/orderModel';
import UserModel from '@/Models/userModel';
import { NextResponse } from 'next/server';
import DeliveryassignModel from '@/Models/deliveryassignModel';

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

        console.log("order" , order);
        
        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 400 }
            );
        }

        order.status = status

        let deliverypartner = [];

        if (status == "Out for delivery" && !order.assigned) {
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

            order.assigned = deliveryAssign._id;

            deliverypartner = availableDeliveryPartnerObjects.map(b => ({
                id: b._id,
                name: b.name,
                mobile: b.mobile,
                latitude: b.location.coordinates[1],
                longitude: b.location.coordinates[0],
            }));

            await deliveryAssign.populate("currentOrderId")
        }

        await order.save();
        await order.populate("user")
        await order.populate("vendor")

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