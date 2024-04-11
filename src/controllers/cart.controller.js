import CartService from "../services/cart.service.js";

export default class CartController {
  constructor() {
    this.cartService = new CartService();
  }

  createCart = (req, res) => {
    this.cartService
      .createCart()
      .then((cart) => res.send({ success: true, payload: cart }))
      .catch((error) => res.send({ status: "error", error: error }));
  };

  getCart = (req, res) => {
    const cid = req.params.cid;
    this.cartService
      .getCart(cid)
      .then((result) => res.send({ success: true, payload: result }))
      .catch((error) => res.send({ status: "error", error: error }));
  };

  addProductToCart = (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    this.cartService
      .addProductToCart(cid, pid)
      .then((result) => res.send({ success: true, payload: result }))
      .catch((error) => res.send({ status: "error", error: error }));
  };

  deleteProductFromCart = (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    this.cartService
      .deleteProductFromCart(cid, pid)
      .then((result) => res.send({ success: true, payload: result }))
      .catch((error) => res.send({ status: "error", error: error }));
  };

  updateCart = (req, res) => {
    const cid = req.params.cid;
    const products = req.body;
    this.cartService
      .updateCart(cid, products)
      .then((result) => res.send({ success: true, payload: result }))
      .catch((error) => res.send({ status: "error", error: error }));
  };

  updateProductQuantity = (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity;
    this.cartService
      .updateProductQuantity(cid, pid, quantity)
      .then((result) => res.send({ success: true, payload: result }))
      .catch((error) => res.send({ status: "error", error: error }));
  };

  deleteAllProductsFromCart = (req, res) => {
    const cid = req.params.cid;
    this.cartService
      .deleteAllProductsFromCart(cid)
      .then((result) => res.send({ success: true, payload: result }))
      .catch((error) => res.send({ status: "error", error: error }));
  };
}
