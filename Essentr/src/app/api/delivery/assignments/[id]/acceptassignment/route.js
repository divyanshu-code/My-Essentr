import { NextResponse } from 'next/server';
import connectDB from '@/Config/Db';
import { auth } from '@/auth';
import DeliveryassignModel from '@/Models/deliveryassignModel';
import OrderModel from '@/Models/orderModel';

export async function POST(request, { params }) {

    try {

        await connectDB();
        const resolvedParams = await params;
        const { id } = resolvedParams;

        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const deliveryboyid = session?.user?.id;

        const assignment = await DeliveryassignModel.findById(id);

        if (!assignment) {
            return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
        }

        if (assignment.status !== 'broadcasted') {
            return NextResponse.json({ error: 'Assignment already processed' }, { status: 400 });
        }

        const alreadyAccepted = await DeliveryassignModel.findOne({
            broadCastedTo: deliveryboyid,
            status: { $nin: ["broadcasted", "completed"] },
        });

        if (alreadyAccepted) {
            return NextResponse.json({ error: 'You are already assigned to an order' }, { status: 400 });
        }

        assignment.status = 'assigned';
        assignment.acceptedAt = new Date();
        assignment.assignCastedTo = deliveryboyid;

        await assignment.save();

        const order = await OrderModel.findById(assignment.currentOrderId);

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        order.assignedDeliverypartner = deliveryboyid;
        await order.save();

        await DeliveryassignModel.updateMany(
            {
                _id: { $ne: assignment._id },
                broadCastedTo: deliveryboyid,
                status: "broadcasted"
            },
            { $pull: { broadCastedTo: deliveryboyid } }
        );

        return NextResponse.json({
            message: 'Order accepted successfully',
        }, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to accept assignment' }, { status: 500 });
    }
}
