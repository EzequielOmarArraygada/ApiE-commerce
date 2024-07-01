import { expect } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const requester = supertest(`http://localhost:${process.env.PORT || 8080}`);

let productId;

describe("Carritos API", function() {
    before(async function() {
        // Conectar a la base de datos antes de las pruebas
        await mongoose.connect(process.env.MONGO_URL);

        // Crear un producto antes de los tests
        const response = await requester.post("/products").send({
            title: "Producto para el carrito",
            description: "Descripción del producto para el carrito",
            price: 100,
            thumbnail: "test.jpg",
            code: "test-code",
            stock: 50,
            category: "Alimento",
            status: "Disponible"
        });
        productId = response.body._id;
    });

    after(async function() {
        // Eliminar el producto creado y cerrar la conexión a la BD
        if (productId) {
            await requester.delete(`/products/${productId}`);
        }
        await mongoose.connection.close();
    });

    it("should create a new cart", async function() {
        const res = await requester.post("/carts");
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('_id');
    });

    it("should add a product to the cart", async function() {
        const cartRes = await requester.post("/carts");
        const cartId = cartRes.body._id;

        const res = await requester.post(`/carts/${cartId}/products`).send({ productId, quantity: 1 });
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('products');
    });

    it("should remove a product from the cart", async function() {
        const cartRes = await requester.post("/carts");
        const cartId = cartRes.body._id;

        await requester.post(`/carts/${cartId}/products`).send({ productId, quantity: 1 });

        const res = await requester.delete(`/carts/${cartId}/products/${productId}`);
        expect(res.status).to.equal(200);
    });
});
