import mongoose from "mongoose";

const EVoucherSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
    eImage: {
        type: String,
    },
    senderName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    receiverName: {
        type: String,
    },
    code: {
        type: String,
        unique: true,
    },
    validPeriod: {
        value: { type: Number, required: true },
        unit: { type: String, enum: ['days', 'weeks', 'months'], required: true },
    },
    validDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['active', 'used', 'expired'],
        default: 'active',
    }
}, {
    timestamps: true,
});

export default mongoose.models.EVoucher || mongoose.model('EVoucher', EVoucherSchema);