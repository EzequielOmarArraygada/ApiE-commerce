import express from 'express';
import { ProductManager } from '../dao/Manejadores/ProductManager.js';

const router = express.Router()

const prct = new ProductManager();

router.get('/', async (req, res) => {
    const products = prct.getProducts();
    res.render('realTimeProducts', {
        products
    });
});

export default router