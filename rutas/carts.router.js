import { Router } from "express";
import { CartManagerMongo } from "../dao/manejadores/CartManagerMongo.js";

const cartRouter = Router()
const crt = new CartManagerMongo()

cartRouter.get ("/", async (req, res) => {
    try {
        let result = await crt.getCarts()
        res.send ({result: "success", payload: result})
    } catch (error){
        console.error ("Error al cargar el carro", error)
    }
});

cartRouter.get ('/:cid', async (req, res)=>{
    try{

        const {cid} = req.params
        const cart = await crt.getCart(cid) 
        res.send ({result: "success", payload: cart})
    } catch (error) {
        console.error("Error al cargar el carro", error);
        res.status(500).send({ error: error.message });
    }
});

cartRouter.post ("/", async (req, res) => {
    let result = await crt.addCart()
    res.send ({result: "success", payload: result})
});

cartRouter.post ("/:cid/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const result = await crt.addToCart (cid, pid) 
        res.send ({result: "success", payload: result})
    } catch (error) {
        console.error("No se pudo agregar al carro", error);
    }
    
});

cartRouter.delete("/:cid/products/:pid", async(req, res) => {
    let {cid, pid} = req.params 
    let result = await crt.deleteProduct(pid, cid) 
    res.send ({result:"success", payload: result})
});

cartRouter.delete("/:cid", async(req, res) => {
    try {
        const { cid } = req.params;
        const result = await crt.deleteAllProducts(cid);
        res.send({ result: "success", payload: result });
    } catch (error) {
        console.error("No se ha podido borrar los productos del carro", error);
        res.status(500).send({ error: error.message });
    }
});

cartRouter.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const result = await crt.updateProductQuantity(cid, pid, quantity);
        res.send({ result: "success", payload: result });
    } catch (error) {
        console.error("No se ha podido actualizar el carro", error);
        res.status(500).send({ error: error.message });
    }
});

cartRouter.put("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const result = await crt.updateCart(cid);
        res.send({ result: "success", payload: result });
    } catch (error) {
        console.error("No se ha podido actualizar el carro", error);
        res.status(500).send({ error: error.message });
    }
});


export default cartRouter