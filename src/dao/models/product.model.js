import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const productCollection = "products";

const productSchema = new mongoose.Schema({
    title: { type: String, required: true }, 
    description: { type: String, required: true }, 
    price: { type: Number, required: true }, 
    thumbnail: { type: String, required: true }, 
    code: { type: Number, required: [true, "código único de producto"], unique: true }, 
    stock: { type: Number, required: true }, 
    category: {
        type: String,
        enum: ["Alimentos", "Higiene", "Medicación", "Vacunas"]
    },
    status: {
        type: String,
        enum: ["Disponible", "No-Disponible"]
    },
});

productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model(productCollection, productSchema);

export default productModel;
