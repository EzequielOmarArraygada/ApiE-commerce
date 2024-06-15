import { ProductManagerMongo } from '../dao/services/managers/ProductManagerMongo.js';
import CustomError from '../services/errors/CustomError.js';
import EError from '../services/errors/enums.js';
import { generateErrorInfo } from '../services/errors/info-products.js';

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
            req.logger.error(
                `Error al obtener los productos: ${error.message}. Método: ${req.method}, URL: ${req.url} - ${new Date().toLocaleDateString()}`
            );
            res.status(500).send({ error: "Ocurrió un error al obtener los productos." });
        }
    }    
    
    getProductById = async (req, res) => {
        try {
            let { pid } = req.params;
            let result = await this.productsService.getProduct(pid);
            res.send({ result: "success", payload: result });
        } catch (error) {
            req.logger.error(
                `Error al obtener el producto por ID: ${error.message}. Método: ${req.method}, URL: ${req.url} - ${new Date().toLocaleDateString()}`
            );
            res.status(500).send({ error: "Ocurrió un error al obtener el producto." });
        }
    }
    
    addProduct = async (req, res, next) => {
        try {
            let { title, description, price, thumbnail, code, stock, category, status } = req.body;
            req.logger.debug(
                `Datos recibidos para agregar el producto: ${JSON.stringify(req.body)}. Método: ${req.method}, URL: ${req.url} - ${new Date().toLocaleDateString()}`
            );
            
            if (!title || !description || !price || !thumbnail || !code || !stock || !category || !status) {
                const err = new CustomError(
                    "Error al crear el producto",
                    generateErrorInfo({ title, description, price, thumbnail, code, stock, category, status }),
                    "Error al intentar crear el producto",
                    EError.INVALID_TYPES_ERROR
                );
                return next(err);
            }
            let result = await this.productsService.addProduct({ title, description, price, thumbnail, code, stock, category, status });
            req.logger.info(
                `Producto agregado con éxito: ${JSON.stringify(result)}. Método: ${req.method}, URL: ${req.url} - ${new Date().toLocaleDateString()}`
            );
            
            res.send({ result: "success", payload: result });
        } catch (error) {
            req.logger.error(
                `Error al agregar el producto: ${error.message}. Método: ${req.method}, URL: ${req.url} - ${new Date().toLocaleDateString()}`
            );
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
    
    updateProduct = async (req, res, next) => {
        try {
            let { pid } = req.params;
            let updatedProduct = req.body;
            let result = await this.productsService.updateProduct(pid, updatedProduct);
            res.send({ result: "success", payload: result });
        } catch (error) {
            req.logger.error(
                `Error al actualizar el producto: ${error.message}. Método: ${req.method}, URL: ${req.url} - ${new Date().toLocaleDateString()}`
            );
            res.status(500).send({ error: "Ocurrió un error al actualizar el producto." });
        }
    }
    
    deleteProduct = async (req, res) => {
        try {
            let { pid } = req.params;
            let result = await this.productsService.deleteProduct(pid);
            res.send({ result: "success", payload: result });
        } catch (error) {
            req.logger.error(
                `Error al eliminar el producto: ${error.message}. Método: ${req.method}, URL: ${req.url} - ${new Date().toLocaleDateString()}`
            );
            res.status(500).send({ error: "Ocurrió un error al eliminar el producto." });
        }
    }   
}
