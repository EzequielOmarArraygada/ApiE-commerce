import express from 'express';
import { ProductManagerMongo } from '../dao/manejadores/ProductManagerMongo.js';

const router = express.Router()

const prct = new ProductManagerMongo();

router.get('/', async (req, res) => {
    try {
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const sortOrder = req.query.sort ? req.query.sort : null;
        const category = req.query.category ? req.query.category : null;

        
        const result = await prct.getProducts(page, limit, sortOrder, category);

        res.render('products', {
            products: result.docs.map(product => product.toObject()),
            totalPages: result.totalPages,
            currentPage: result.page,
            hasNextPage: result.hasNextPage,
            hasPrevPage: result.hasPrevPage,
            nextPage: result.nextPage,
            prevPage: result.prevPage
        });
    } catch (error) {
        console.error("No se pudo actualizar el producto", error);
        res.status(500).send({ error: error.message });
    }
});


router.get('/details/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await prct.getProduct(pid);
        if (product) {
            res.render('product_details', { product });
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        console.error("Error al obtener el detalle del producto", error);
        res.status(500).send({ error: error.message });
    }
});

router.get('/:pid', async (req, res) => {
    let { pid } = req.params;
    let result = await prct.getProduct(pid);
    res.send({ result: "success", payload: result });
});

router.post("/", async (req, res) => {
    let { title, description, price, thumbnail, code, stock, category, status } = req.body;
    if (!title || !description || !price || !thumbnail || !code || !stock || !category || !status) {
        res.status(400).send({ status: "error", error: "Todos los campos son obligatorios" });
        return;
    }
    let result = await prct.addProduct({ title, description, price, thumbnail, code, stock, category, status });
    res.send({ result: "success", payload: result });
});

router.put("/:pid", async (req, res) => {
    try {
        let { pid } = req.params;
        let updatedProduct = req.body;
        let result = await prct.updateProduct(pid, updatedProduct);
        res.send({ result: "success", payload: result });
    } catch (error) {
        console.error("No se pudo actualizar el producto", error);
        res.status(500).send({ error: error.message });
    }
});

router.delete("/:pid", async (req, res) => {
    let { pid } = req.params;
    let result = await prct.deleteProduct(pid);
    res.send({ result: "success", payload: result });
});

export default router;