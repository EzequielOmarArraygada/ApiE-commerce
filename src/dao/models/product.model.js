import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = "products";


const productSchema = new mongoose.Schema({
<<<<<<< Updated upstream
  title: { type: String, required: true, max: 150, index: true },
  description: { type: String, required: true, max: 300 },
  code: { type: String, required: true, max: 10, unique: true, index: true },
  price: { type: Number, required: true },
  status: { type: Boolean, required: false, default: true },
  stock: { type: Number, required: true, integer: true },
  category: { type: String, required: true, max: 20, index: true },
  thumbnail: { type: Array, required: false },
=======
    title: { type: String, required: true, max: 150, index: true },
    description: { type: String, required: true, max: 300 },
    code: { type: String, required: true, max: 10, unique: true, index: true },
    price: { type: Number, required: true },  // Asegúrate de que los datos en la BD sean números.
    status: { type: Boolean, required: false, default: true },
    stock: { type: Number, required: true },  // `integer: true` no es necesario.
    category: { type: String, required: true, max: 20, index: true },
    thumbnail: { type: String, required: false },  // O { type: [String], required: false } si es un array.
>>>>>>> Stashed changes
});

//se le añade el plugin para el paginate
productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model(productsCollection, productSchema);

export default productModel;
