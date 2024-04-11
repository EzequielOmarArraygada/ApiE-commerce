import express from "express";
import CartController from "../../controllers/cart.controller.js";

const router = express.Router();
const {
  createCart,
  getCart,
  addProductToCart,
  deleteProductFromCart,
  updateCart,
  updateProductQuantity,
  deleteAllProductsFromCart,
} = new CartController();

router.post("/", createCart);

router.get("/:cid", getCart);

router.post("/:cid/product/:pid", addProductToCart);

router.delete("/:cid/product/:pid", deleteProductFromCart);

router.put("/:cid", updateCart);

router.put("/:cid/product/:pid", updateProductQuantity);

router.delete("/:cid", deleteAllProductsFromCart);

export default router;
