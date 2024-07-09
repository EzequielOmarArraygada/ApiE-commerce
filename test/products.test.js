// test/products.test.js
import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app.js'; // Ajusta la ruta según sea necesario

describe('Productos API', function() {
  let cookie;

  before(async function() {
    // Autenticar y obtener la cookie
    const response = await request(app)
      .post('/api/sessions/login') // Ajusta la ruta de login según tu configuración
      .send({
        email: 'test@example.com',
        password: 'password123' // Usa credenciales válidas para obtener la cookie
      });

    // Obtén la cookie del encabezado 'set-cookie'
    cookie = response.headers['set-cookie']; // Obtiene todas las cookies
  });

  it('Debería obtener todos los productos', async function() {
    const response = await request(app)
      .get('/products') // Ajusta la ruta según sea necesario
      .set('Cookie', cookie); // Incluye la cookie en la solicitud

    expect(response.status).to.equal(200);
    // Realiza las demás comprobaciones necesarias
  });

  it('Debería crear un nuevo producto', async function() {
    const response = await request(app)
      .post('/products') // Ajusta la ruta según sea necesario
      .set('Cookie', cookie) // Incluye la cookie en la solicitud
      .send({
        title: 'Nuevo Producto Nuevo Nuevo 2',
        description: 'Descripción del nuevo producto',
        price: 100,
        thumbnail: [],
        code: 'lal12ddd1af2433a',
        stock: 50,
        category: "PRUEBAS",
        status: true
      });

    expect(response.status).to.equal(200);
  });

  it('Debería obtener un producto por ID', async function() {
    const response = await request(app)
      .get(`/products/668d653bd3054e73c7963a0a`) // Ajusta la ruta según sea necesario
      .set('Cookie', cookie); // Incluye la cookie en la solicitud

    expect(response.status).to.equal(200);
  });

  it('Debería actualizar un producto', async function() {
    const response = await request(app)
      .put(`/products/668d653bd3054e73c7963a0a`) // Ajusta la ruta según sea necesario
      .set('Cookie', cookie) // Incluye la cookie en la solicitud
      .send({
        title: 'Nuevo Producto 34',
        description: 'Descripción del nuevo producto',
        price: 100,
        thumbnail: [],
        code: 'lalaaaaaaaaaa',
        stock: 50,
        category: "PRUEBAS",
        status: true
      });

    expect(response.status).to.equal(200);
  });

  it('Debería eliminar un producto', async function() {
    const response = await request(app)
      .delete(`/products/668d67aa47215d4f2806e366`) // Ajusta la ruta según sea necesario
      .set('Cookie', cookie); // Incluye la cookie en la solicitud

    expect(response.status).to.equal(200);
  });
});
