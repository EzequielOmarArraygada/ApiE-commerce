import * as chai from "chai";
import supertest from "supertest";

const expect= chai.expect
const requester= supertest("http://localhost:8080")

describe("test products", ()=>{
    describe("test post product", function (){
        it("el endpoint POST /products debe crear un producto correctamente", async () => {

            const productMock = {
                title: "test", 
                description: "test", 
                price: "10", 
                thumbnail: "test.jpg", 
                code: "1111", 
                stock: "10", 
                category: "Lego",
                status: "Disponible"
            }

            const {ok, statusCode, _body} = await requester.post ("/products").send(productMock)

            console.log(ok)
            console.log(statusCode)
            console.log(_body)
            expect(_body.payload).to.have.property("_id")
        })

        it("el endpoint POST /products debe enviar un status 400 cuando no se le agrega título al producto", async () => {

            const productMock = {
                description: "test", 
                price: "10", 
                thumbnail: "test.jpg", 
                code: "1111", 
                stock: "10", 
                category: "Lego",
                status: "Disponible"
            }

            const {statusCode, _body} = await requester.post ("/products").send(productMock)

            console.log(statusCode)
            console.log(_body)
            expect(statusCode).to.equal(400)
            expect(_body).to.have.property("error")
        })

        it("el endpoint PUT /products/:pid debe editar un producto correctamente", async () => {

            const productMock = {
                title: "test", 
                description: "test", 
                price: "10", 
                thumbnail: "test.jpg", 
                code: "1111", 
                stock: "10", 
                category: "Lego",
                status: "Disponible"
            }

            const createProduct = await requester
                .post ("/products/:pid")
                .send(productMock)

            const productId = createProduct.body._id

            const productMockUpdate = {
                title: "testUpdate", 
                description: "test", 
                price: "10", 
                thumbnail: "test.jpg", 
                code: "1111", 
                stock: "10", 
                category: "Lego",
                status: "Disponible"
            }

            setTimeout(async ()=>{
                const {statusCode, _body} = (await requester.put(`api/products/${productId}`)).send(productMockUpdate)
                expect(statusCode).to.equal(200)
                expect(_body.payload).to.have.property("title", "testUpdate")
            }, 2000)

        })

    })

})
