import { Router } from "express";
import ProductsRouter from "./products.router.js";
import cartRouter from "./carts.router.js";
import usersRouter from "./users.router.js";
import { chatRouter } from "./chat.router.js";

const router = Router()

router.use("/api/sessions", usersRouter);
router.use("/", ProductsRouter);
router.use('/carts', cartRouter);
router.use('/api/chat', chatRouter);

export default router