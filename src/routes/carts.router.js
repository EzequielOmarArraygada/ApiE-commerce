import { Router } from "express";
import { CartController } from '../controllers/carts.controller.js';

const cartRouter = Router()

const {
    getCarts,
    getCartById,
    addCart,
    addToCart,
    updateProductQuantity,
    updateCart,
    deleteProduct,
    deleteAllProducts,
    getPurchase,
    checkout
} = new CartController();

cartRouter.get ("/", getCarts)

cartRouter.get("/:cid", getCartById);

cartRouter.post ("/", addCart)

cartRouter.post ("/:cid/:pid", addToCart)

cartRouter.put("/:cid/products/:pid", updateProductQuantity);

cartRouter.put("/:cid", updateCart);

cartRouter.delete("/:cid/products/:pid", deleteProduct)

cartRouter.delete("/:cid", deleteAllProducts);

cartRouter.post("/:cid", checkout);

cartRouter.get("/:cid/purchase", getPurchase);

export default cartRouter