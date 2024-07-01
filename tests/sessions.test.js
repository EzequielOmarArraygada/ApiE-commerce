import { expect } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const requester = supertest(`http://localhost:${process.env.PORT || 8080}`);

describe("Sesiones API", function() {
    before(async function() {
        // Conectar a la base de datos antes de las pruebas
        await mongoose.connect(process.env.MONGO_URL);
    });

    after(async function() {
        // Cerrar la conexión a la BD
        await mongoose.connection.close();
    });

    it("should register a new user", async function() {
        const res = await requester.post("/signup").send({
            username: "testuser",
            password: "testpassword",
            email: "testuser@example.com"
        });
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('user');
    });

    it("should log in the user", async function() {
        await requester.post("/signup").send({
            username: "testuser",
            password: "testpassword",
            email: "testuser@example.com"
        });

        const res = await requester.post("/login").send({
            username: "testuser",
            password: "testpassword"
        });
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('token');
    });

    it("should get the current user session", async function() {
        const loginRes = await requester.post("/login").send({
            username: "testuser",
            password: "testpassword"
        });

        const token = loginRes.body.token;

        const res = await requester.get("/current").set('Authorization', `Bearer ${token}`);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('user');
    });
});
