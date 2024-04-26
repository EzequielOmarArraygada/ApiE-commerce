import { ProductManagerMongo } from '../dao/services/managers/ProductManagerMongo.js';

export class ProductController {
    constructor(){
        this.productsService = new ProductManagerMongo();
    }
    getHome = (req, res) => {
        res.redirect('/products?page=1');
    }

    getLogin = (req, res) => {
        res.render("login");
    }

    getSignup = (req, res) => {
        res.render("signup");
    }

    getProducts = async (req, res) => {
        try {
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit) : 10;
            const sortOrder = req.query.sort ? req.query.sort : null;
            const category = req.query.category ? req.query.category : null;
            const status = req.query.status ? req.query.status : null;
    
            let cartId = null;
            if (req.isAuthenticated()) {
                const user = req.user;
                cartId = user.cart ? user.cart : null;
            }
    
            const result = await this.productsService.getProducts(page, limit, sortOrder, category, status);
    
            result.prevLink = result.hasPrevPage ? `/products?page=${result.prevPage}` : '';
            result.nextLink = result.hasNextPage ? `/products?page=${result.nextPage}` : '';
            result.isValid = !(page <= 0 || page > result.totalPages);
    
            res.render('products', { user: req.user, products: result.docs, cartId, ...result });
    
        } catch (error) {
            console.error("Error", error);
        }
    }    
    
    getProductById = async (req, res) => {
        let { pid } = req.params;
        let result = await this.productsService.getProduct(pid);
        res.send({ result: "success", payload: result });
    }
    
    addProduct = async (req, res) => {
        try {
            let { title, description, price, thumbnail, code, stock, category, status } = req.body;
            console.log("Datos recibidos para agregar el producto:", req.body); 
            if (!title || !description || !price || !thumbnail || !code || !stock || !category || !status) {
                console.log("Todos son datos son obligatorios"); 
                res.status(400).send({ status: "error", error: "Datos incompletos" });
                return;
            }
            let result = await this.productsService.addProduct({ title, description, price, thumbnail, code, stock, category, status });
            console.log("Producto agregado exitosamente:", result); 
            res.send({ result: "success", payload: result });
        } catch (error) {
            console.error("Error", error); 
            res.status(500).send({ error: "Error del servidor" });
        }
    }
    
    
    updateProduct = async (req, res) => {
        try {
            let { pid } = req.params;
            let updatedProduct = req.body;
            let result = await this.productsService.updateProduct(pid, updatedProduct);
            res.send({ result: "success", payload: result });
        } catch (error) {
            console.error("Error al actualizar", error);
            res.status(500).send({ error: error.message });
        }
    }
    
    deleteProduct = async (req, res) => {
        let { pid } = req.params;
        let result = await this.productsService.deleteProduct(pid);
        res.send({ result: "success", payload: result });
    }
}

