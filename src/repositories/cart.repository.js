import cartModel from "../dao/models/cart.model.js";
import productModel from "../dao/models/product.model.js";
import Ticket from "../dao/models/ticket.model.js";
import { ProductManagerMongo } from "../dao/services/managers/ProductManagerMongo.js";
import User from "../dao/models/user.model.js";

export class CartRepository {
    constructor(){
        this.model = cartModel;
        this.productsService = new ProductManagerMongo();
        this.userService = User;
    }

    async getCarts(){
        try {
            return await this.model.find({}).populate('products');
        } catch (error) {
            console.error("Error al mostrar carros", error);
            throw error;
        }
    }

    async getCartById(cid) {
        try {
            return await this.model.findById(cid).populate('products');
        } catch (error) {
            console.error("Error al obtener el carro:", error);
            throw error;
        }
    }
    
    async addCart(userEmail) {
        const newCart = {
            products: [],
            userEmail: userEmail 
        };
        return await this.model.create(newCart)
    }

    async addToCart(cid, pid) {
        try {
            const cartExists = await this.model.findOne({ _id: cid });
            if (!cartExists) {
                throw new Error(`No se encontró el carro ID: ${cid}`);
            }
    
            const productExists = await productModel.findOne({ _id: pid });
            if (!productExists) {
                throw new Error(`No se encontró el producto ID: ${pid}`);
            }
    
            const existingProduct = cartExists.products.find(product => product.productId.toString() === pid.toString());
           
            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                cartExists.products.push({
                    productId: pid,
                    product: productExists,
                    quantity: 1
                });
            }
    
            await cartExists.save(); 
            return "Producto agregado exitosamente";
        } catch (error) {
            console.error("Error al agregar el producto al carro:", error);
            throw error;
        }
    }
    
    async updateCart(cart) {
        try {
            await this.model.findByIdAndUpdate(cart._id, cart);
            return "Carrito actualizado exitosamente";
        } catch (error) {
            console.error("Error al actualizar el carro:", error);
            throw error;
        }
    }

    async deleteProduct(pid, cid) {
        try {
            const cart = await this.model.findById(cid);
            if (!cart) {
                throw new Error(`No se encontró el carro de ID ${cid}`);
            }
    
            const productIndex = cart.products.findIndex(product => product.productId.toString() === pid.toString());
            if (productIndex === -1) {
                throw new Error(`No se encontró el producto con id ${pid} en el carro`);
            }
    
            cart.products.splice(productIndex, 1); 

            await this.updateCart(cart);

            return "Producto eliminado exitosamente del carro";
        } catch (error) {
            console.error("Error al eliminar el producto del carro:", error);
            throw error;
        }
    }

    async updateProductQuantity(cid, pid, quantity) {
        try {
            const cart = await this.model.findById(cid);
            if (!cart) {
                throw new Error(`No se encontró el carro de ID: ${cid}`);
            }

            const productIndex = cart.products.findIndex(product => product.productId.toString() === pid.toString());
            if (productIndex === -1) {
                throw new Error(`No se encontró el producto de ID ${pid} en el carro`);
            }

            cart.products[productIndex].quantity = quantity;

            await this.updateCart(cart);

            return "Cantidad de producto actualizada exitosamente";

        } catch (error) {
            console.error("Error al actualizar la cantidad del producto", error);
            throw error;
        }
    }

    async deleteAllProducts(cid) {
        try {
            const cart = await this.model.findById(cid);
            if (!cart) {
                throw new Error(`No se encontró el carro de ID: ${cid}`);
            }
    
            cart.products = []; 
    
            await this.updateCart(cart);
    
            return "Todos los productos fueron eliminados del carro exitosamente";
        } catch (error) {
            console.error("Error al eliminar todos los productos del carro:", error);
            throw error;
        }
    }

    async checkout(cartId) {
        try {
            function generateUniqueCode() {
                const timestamp = new Date().getTime();
                const random = Math.floor(Math.random() * 1000); 
                return `${timestamp}-${random}`;
            }            
    
            const cart = await this.getCartById(cartId);
    
            const user = await User.findOne({ cart: cart._id });
            if (!user) {
                throw new Error('No se encontró el usuario asociado al carrito');
            }
    
            const userEmail = user.email;
    
            const productsInTicket = [];
            const productsInCart = [];
            let totalAmount = 0; 
            for (const product of cart.products) {
                const productDetails = await productModel.findById(product.productId);
                console.log("Product details:", productDetails); 
                if (productDetails.stock >= product.quantity) {
                    const subtotal = productDetails.price * product.quantity; 
                    totalAmount += subtotal; 
                    productsInTicket.push({
                        productId: productDetails._id,
                        quantity: product.quantity,
                        price: productDetails.price,
                        subtotal: subtotal 
                    });
    
                    productDetails.stock -= product.quantity;
                    await productDetails.save();
                } else {
                    productsInCart.push({
                        productId: productDetails._id,
                        quantity: 0, 
                        price: productDetails.price,
                        subtotal: 0 
                    });
                }
            }
    
            cart.products = productsInCart;
            await cart.save();
    
            const ticket = new Ticket({
                code: generateUniqueCode(), 
                purchaser: userEmail, 
                products: productsInTicket, 
                totalAmount: totalAmount 
            });
    
            await ticket.save();
    
            return ticket;
        } catch (error) {
            console.error("Error al procesar la compra:", error);
            throw error;
        }
    }    
}
