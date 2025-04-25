import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false },
    eVoucher: { type: mongoose.Schema.Types.ObjectId, ref: 'EVoucher', required: false },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    selectedColor: String,
    selectedSize: String,

    // eVoucher-specific fields
    senderName: String,
    receiverName: String,
    note: String,
    validDate: Date,
    type: { type: String, enum: ['product', 'evoucher'], required: true }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [OrderItemSchema],
    totalAmount: { type: Number, required: true },
    shippingAddress: { type: Object, required: false },
    shippingMethod: { type: String },
    orderNumber: { type: String, required: true, unique: true },
    paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    orderStatus: { type: String, enum: ['processing', 'shipped', 'delivered'], default: 'processing' }
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
