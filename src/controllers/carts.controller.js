import { ProductManagerMongo } from '../dao/services/managers/ProductManagerMongo.js';
import { CartManagerMongo } from '../dao/services/managers/CartManagerMongo.js';
import { UserRepository } from '../repositories/user.repository.js';

export class CartController {
    constructor(){
        this.productsService = new ProductManagerMongo();
        this.cartsService = new CartManagerMongo();
        this.userService = new UserRepository();
    }
    getCarts = async (req, res) => {
        try {
            let result = await this.cartsService.getCarts()
            res.send ({result: "success", payload: result})
        } catch (error){
            console.error ("No se pudieron cargar los carros", error)
        }
    }

    getCartById = async (req, res) => {
        try {
            const { cid } = req.params;
            const cart = await this.cartsService.getCartById(cid);
            
            const productsDetails = [];
            let totalPrice = 0; 
            
            for (const product of cart.products) {
                const productDetails = await this.productsService.getProduct(product.productId);
                const productWithQuantity = { ...productDetails, quantity: product.quantity }; 
                productsDetails.push(productWithQuantity);
                
                const subtotal = productDetails.price * product.quantity;
                totalPrice += subtotal;
            }
    
            console.log(productsDetails);
            
            res.render("carts", { cart, productsDetails, totalPrice, cartId: cart._id }); // Pasamos el total a la vista
        } catch (error) {
            console.error("Error al obtener el carro:", error);
            res.status(500).send({ error: error.message });
        }
    }
    
    addCart = async (req, res) => {
        let result = await this.cartsService.addCart ()
        res.send ({result: "success", payload: result})
    }
    
    addToCart = async (req, res) => {
        try {
            let { cid, pid } = req.params;
            
            let result = await this.cartsService.addToCart (cid, pid)
            
            res.send ({result: "success", payload: result})
        } catch (error) {
            console.error("Error al agregar producto al carro:", error);
        }
        
    }
    
    updateProductQuantity = async (req, res) => {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;
            const result = await this.cartsService.updateProductQuantity(cid, pid, quantity);
            res.send({ result: "success", payload: result });
        } catch (error) {
            console.error("Error al actualizar la cantidad del producto en el carro:", error);
            res.status(500).send({ error: error.message });
        }
    }

    updateCart = async (req, res) => {
        try {
            const { cid } = req.params;
            const result = await this.cartsService.updateCart(cid);
            res.send({ result: "success", payload: result });
        } catch (error) {
            console.error("Error al actualizar el carro:", error);
            res.status(500).send({ error: error.message });
        }
    }

    deleteProduct = async(req, res) => {
        let {cid, pid} = req.params 
        let result = await this.cartsService.deleteProduct(pid, cid) 
        res.send ({result:"success", payload: result})
    }

    deleteAllProducts = async(req, res) => {
        try {
            const { cid } = req.params;
            const result = await this.cartsService.deleteAllProducts(cid);
            res.send({ result: "success", payload: result });
        } catch (error) {
            console.error("Error al eliminar todos los productos del carro:", error);
            res.status(500).send({ error: error.message });
        }
    }

    checkout = async(req, res) => {
        try {
            const { cid } = req.params;
            console.log("ID Carro:", cid); 
    
            const cart = await this.cartsService.getCartById(cid);
            console.log("Detalles del carro:", cart); /
    
            const ticket = await this.cartsService.checkout(cart);
    
            res.redirect(`${cid}/purchase`);
        } catch (error) {
            console.error("Error", error);
            res.status(500).send({ error: error.message });
        }
    }
    
    getPurchase = async (req, res) => {
        try {
            const { cid } = req.params;
            res.json({ message: `Compra exitosa` });
        } catch (error){
            console.error ("Error", error)
        }
    }

    getUserCartId = async (req, res) => {
        try {
            const userId = req.user._id;
            console.log('ID de usuario:', userId);
    
            const user = await this.userService.findById(userId);
    
            if (user) {
                console.log('ID del carro del usuario:', user.cart);
                res.status(200).json({ cartId: user.cart });
            } else {
                res.status(404).json({ error: 'Not found' });
            }
        } catch (error) {
            console.error('Error', error);
            res.status(500).json({ error: 'Error del servidor' });
        }
    }

}