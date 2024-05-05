const express = require('express');
const router = express.Router();
const faker = require('faker');

router.get('/mockingproducts', (req, res) => {
  const products = Array.from({ length: 100 }, () => ({
    name: faker.commerce.productName(),
    price: faker.commerce.price(),
  }));

  res.json(products);
});

module.exports = router;