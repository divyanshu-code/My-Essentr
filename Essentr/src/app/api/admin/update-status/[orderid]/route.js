import connectDB from '@/Config/Db';
import OrderModel from '@/Models/orderModel';
import UserModel from '@/Models/userModel';
import { NextResponse } from 'next/server';
import DeliveryassignModel from '@/Models/deliveryassignModel';
import Emiteventhandler from '@/Config/Emiteventhandler';
import MasterOrderModel from '@/Models/masterModel';

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

        const childorder = await OrderModel.findById(orderid).populate("user")

        if (!childorder) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 400 }
            );
        }

        const masterOrder = await MasterOrderModel.findById(childorder.parentOrder);
        if (!masterOrder) {
            return NextResponse.json({ error: 'Master order not found' }, { status: 400 });
        }

        let deliverypartner = [];

        if (status == "Out for delivery" && !childorder.assigned) {

            const existingAssignment = await DeliveryassignModel.findOne({ masterOrderId: masterOrder._id });
            if (existingAssignment) {
                return NextResponse.json({ message: "Assignment already exists" }, { status: 200 });
            }

            const { latitude, longitude } = masterOrder.shippingAddress;

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
                await childorder.save();

                return NextResponse.json(
                    { error: 'No available delivery partners found' },
                    { status: 400 }
                );
            }

            const deliveryAssign = await DeliveryassignModel.create({
                masterOrderId: masterOrder._id,
                currentOrderId: childorder._id,
                broadCastedTo: candidates,
                status: "broadcasted",
                vendorId: childorder.vendor?._id || childorder?.vendor,
            });

            masterOrder.assigned = deliveryAssign._id;
            await masterOrder.save();

            const populatedAssign = await DeliveryassignModel.findById(deliveryAssign._id)
                .populate({
                    path: 'masterOrderId',
                    populate: { path: 'childOrders' }
                });

            for (const boyId of candidates) {
                const boy = await UserModel.findById(boyId)
                if (boy?.socketId) {
                    await Emiteventhandler("new-assignments", populatedAssign, boy.socketId)
                }
            }

            deliverypartner = availableDeliveryPartnerObjects.map(b => ({
                id: b._id,
                name: b.name,
                mobile: b.mobile,
                latitude: b.location.coordinates[1],
                longitude: b.location.coordinates[0],
            }));
        } 

        childorder.status = status;

        if (masterOrder.assigned) {
            childorder.assigned = masterOrder.assigned;
        }
        
        await childorder.save();

        await Emiteventhandler("order_status_updated", {
            orderId: childorder._id,
            masterId: masterOrder._id,
            status: childorder.status,
        })

        return NextResponse.json({
            success: true,
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