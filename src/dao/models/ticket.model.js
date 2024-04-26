import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number },
    price: { type: Number },
    subtotal: { type: Number } 
});

const ticketSchema = new mongoose.Schema({
    code: { type: String, unique: true },
    purchase_datetime: { type: Date, default: Date.now },
    purchaser: { type: String },
    products: [productSchema],
    totalAmount: { type: Number } 
});

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;




