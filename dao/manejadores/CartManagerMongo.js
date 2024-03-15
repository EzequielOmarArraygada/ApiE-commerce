import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";

export class CartManagerMongo {
    constructor(){
        this.model = cartModel
    }

    async getCarts(){
        try {
            return await this.model.find({}).populate('products');
        } catch (error) {
            console.error("No se pudo mostrar el carro", error);
            throw error;
        }
    }

    async getCart(cid) {
        try {
            return await this.model.findById(cid).populate('products');
        } catch (error) {
            console.error("No se pudo mostrar el carro", error);
            throw error;
        }
    }

    async addCart(){
        const newCart = {
            products: []
        };
        return await this.model.create(newCart)
    }

    async addToCart(cid, pid) {
        try {
            let cartExists = await this.model.findById(cid);
    
            if (!cartExists) {
                cartExists = await this.addCart();
                console.log('Carro nuevo creado')
            }
            const productExists = await productModel.findById(pid);
            if (!productExists) {
                throw new Error(`El producto con id ${pid} no existe`);
            }
                const existingProduct = cartExists.products.find(product => product.productId.toString() === pid.toString());
    
            if (existingProduct) {
                existingProduct.quantity++;
                console.log('producto exste y se suma')

            } else {
                cartExists.products.push({
                    productId: pid,
                    quantity: 1
                });
                console.log('Producto agergado en el carro')

            }
            await this.updateCart(cartExists);
            return "Producto agregado exitosamente";
    
        } catch (error) {
            console.error("No se pudo agregar el producto al carro:", error);
            throw error;
        }
    }
    async deleteProduct(pid, cid) {
        try {
            const cart = await this.model.findById(cid);
            if (!cart) {
                throw new Error(`El carro con id ${cid} no existe`);
            }
    
            const productIndex = cart.product.findIndex(product => product.productId.toString() === pid.toString());
            if (productIndex === -1) {
                throw new Error(`El producto con id ${pid} no existe en el carro`);
            }
    
            cart.products.splice(productIndex, 1); 

            await this.updateCart(cart);
            return "Se ah eliminado el producto del carro";

        } catch (error) {
            console.error("No se ah podido sacar el producto del carro", error);
            throw error;
        }
    }
    async updateCart(cart) {
        try {
            await this.model.findByIdAndUpdate(cart._id, cart);
            return "Se ah actualizado el carro";
        } catch (error) {
            console.error("No se ah podido actualizar el carro", error);
            throw error;
        }
    }    
}

