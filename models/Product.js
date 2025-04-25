import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    mainImage: { type: String, required: true },
    subImages: { type: [String], default: [] },
    features: { type: [String], default: [] },
    price: { type: Number, required: true },
    discountedPrice: { type: Number },
    colors: { type: [String], default: [] },
    sizes: { type: [String], default: [] },
    ratings: {
        rating: { type: Number, min: 0, max: 5 },
        count: { type: Number, default: 0 },
    },
    purchases: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    reviews: { type: [String], default: [] },
    status: { type: String, enum: ['New', 'In Stock', 'Sold Out'], default: 'New' },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', productSchema);
