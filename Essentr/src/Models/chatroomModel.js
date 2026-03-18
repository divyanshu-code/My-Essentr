import mongoose from "mongoose";

const chatroomSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    deliveryBoyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
   
} , { timestamps: true});

const ChatModel = mongoose.models.Chatroom ||  mongoose.model('Chatroom', chatroomSchema);

export default ChatModel ;