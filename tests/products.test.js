import { expect } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const requester = supertest(`http://localhost:${process.env.PORT || 8080}`);
let productId;

describe("Productos API", function() {
    before(async function() {
        // Conectar a la base de datos antes de las pruebas
        await mongoose.connect(process.env.MONGO_URL);
    });

    after(async function() {
        // Eliminar el producto creado y cerrar la conexión a la BD
        if (productId) {
            await requester.delete(`/products/${productId}`);
        }
        await mongoose.connection.close();
    });

    it("should create a new product", async function() {
        const res = await requester.post("/products").send({
            title: "Producto de prueba",
            description: "Descripción del producto",
            price: 100,
            thumbnail: "test.jpg",
            code: "test-code",
            stock: 50,
            category: "Alimento",
            status: "Disponible"
        });
        productId = res.body._id;
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('_id');
    });

    it("should retrieve the created product", async function() {
        const res = await requester.get(`/products/${productId}`);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('_id');
        expect(res.body._id).to.equal(productId);
    });

    it("should update the product", async function() {
        const res = await requester.put(`/products/${productId}`).send({ price: 200 });
        expect(res.status).to.equal(200);
        expect(res.body.price).to.equal(200);
    });
});
