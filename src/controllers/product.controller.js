import ProductService from "../services/product.service.js";

export default class ProductController {
  constructor() {
    this.productService = new ProductService();
  }

  getProducts = (req, res) => {
    let limit = parseInt(req.query.limit);
    let page = parseInt(req.query.page);
    let sort = parseInt(req.query.sort);
    let status = req.query.status;
    let category = req.query.category;
    limit = limit ? limit : 10;
    page = page ? page : 1;
    if (sort) sort = sort == -1 ? "desc" : "asc";

    const params = {
      limit,
      page,
      sort,
      status,
      category,
    };
    this.productService
      .getProducts(params)
      .then((products) => {
        return res.status(201).json({
          success: true,
          payload: products.docs,
          totalPages: products.totalPages,
          prevPage: products.prevPage,
          nextPage: products.nextPage,
          page: products.page,
          hasPrevPage: products.hasPrevPage,
          hasNextPage: products.hasNextPage,
          prevLink: products.hasPrevPage
            ? `/products?page=${products.prevPage}`
            : null,
          nextLink: products.hasNextPage
            ? `/products?page=${products.nextPage}`
            : null,
        });
      })
      .catch((error) => {
        return res.status(500).json({
          success: false,
          error: "Error " + error,
        });
      });
  };

  createProduct = (req, res) => {
    const product = req.body;
    if (
      !product.title ||
      !product.description ||
      !product.code ||
      !product.price ||
      !product.stock ||
      !product.category
    ) {
      return res.status(402).send({
        success: false,
        message:
          "Los campos son obligatorios",
      });
    }
    this.productService
      .createProduct(product)
      .then((result) =>
        res.status(201).send({ success: true, payload: result })
      )
      .catch((error) =>
        res.status(500).send({
          success: false,
          message: "Error al añadir el producto " + error,
        })
      );
  };

  getProductById = (req, res) => {
    const pid = req.params.pid;
    this.productService
      .getProductById(pid)
      .then((product) => {
        if (product) {
          res.status(201).send({ success: true, payload: product });
        } else {
          res.status(404).send({
            success: false,
            message: `El producto con id ${pid} no existe.`,
          });
        }
      })
      .catch((error) =>
        res.status(500).send({
          success: false,
          message: "Error " + error,
        })
      );
  };

  updateProduct = (req, res) => {
    const pid = req.params.pid;
    const product = req.body;
    this.productService
      .updateProduct(pid, product)
      .then((product) => {
        if (product) {
          res.status(201).send({
            success: true,
            payload: product,
          });
        } else {
          res.status(404).send({
            success: false,
            message: `El producto con el id ${pid} no existe.`,
          });
        }
      })
      .catch((error) =>
        res.status(500).send({
          success: false,
          message: "Error " + error,
        })
      );
  };

  deleteProduct = (req, res) => {
    const pid = req.params.pid;
    this.productService
      .deleteProduct(pid)
      .then((product) => {
        if (product) {
          res.status(201).send({ success: true, payload: product });
        } else {
          res.status(404).send({
            success: false,
            message: `El producto con el id ${pid} no existe.`,
          });
        }
      })
      .catch((error) =>
        res.status(500).send({
          success: false,
          message: "Error al eliminar " + error,
        })
      );
  };
}
