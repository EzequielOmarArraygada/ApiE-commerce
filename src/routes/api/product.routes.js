import express, { query } from "express";
import ProductController from "../../controllers/product.controller.js";

const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = new ProductController();

router.get("/products", getProducts);

router.get("/products/:pid", getProductById);

router.post("/products", createProduct);

router.put("/products/:pid", updateProduct);

router.delete("/products/:pid", deleteProduct);

export default router;