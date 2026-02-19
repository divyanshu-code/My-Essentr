import mongoose from 'mongoose';

const deliveryBoySchema = new mongoose.Schema({

    currentOrderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        default: null
    },

    broadCastedTo: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],

    assignCastedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

    status: {
        type: String,
        enum: ["broadcasted", "assigned", "completed"],
        default: "broadcasted"
    },

    acceptedAt: {
        type: Date
    }


}, { timestamps: true });

const DeliveryassignModel =  mongoose.models.Delivery || mongoose.model('Delivery', deliveryBoySchema);

export default  DeliveryassignModel ;