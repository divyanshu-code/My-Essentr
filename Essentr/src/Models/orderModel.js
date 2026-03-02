import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true,
    },
    
    parentOrder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MasterOrder',
        default: null
    },

    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Grocery",
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            price: {
                type: Number,
            },
            name: {
                type: String
            },
            unit: {
                type: String
            },
            unit1: {
                type: String
            },
            image: {
                type: String
            }
        }
    ],

    shippingAddress: {
        name: { type: String },
        mobile: { type: String },
        address: { type: String, required: true },
        pincode: { type: String, required: true },
        state: { type: String, required: true },
        latitude: { type: Number },
        longitude: { type: Number }
    },

    paymentMethod: {
        type: String,
        required: true,
        enum: ["cod", "razorpay"],
        default: "cod"
    },

    totalamount: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: ["Pending", "Out for delivery", "Delivered", "Cancelled"],
        default: "Pending"
    },

    changeOption: {
        type: String
    },

    change: {
        customerGiveamt: {
            type: Number
        },

        deliveryReturnamt: {
            type: Number
        }
    },

    isPaid: {
        type: Boolean,
        default: false
    },

    razorpayOrderId: {
        type: String,
        required: false
    },

    assignedDeliverypartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

    assigned: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Delivery',
        default: null
    }

}, { timestamps: true });

orderSchema.index({ vendor: 1, createdAt: -1 });

const OrderModel = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default OrderModel;