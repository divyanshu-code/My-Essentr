import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    time: {
        type: String,
        default: Date.now
    }
}, { timestamps: true});

const MessageModel = mongoose.models.Message || mongoose.model('Message', messageSchema);

export default MessageModel;