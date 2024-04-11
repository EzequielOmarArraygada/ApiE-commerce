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

router.get("/", getProducts);

router.get("/:pid", getProductById);

router.post("/", createProduct);

router.put("/:pid", updateProduct);

router.delete("/:pid", deleteProduct);

export default router;
