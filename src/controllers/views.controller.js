import config from "../config/config.js";
import ProductController from "./product.controller.js";

export default class ViewsController {
  constructor() {
    this.productController = new ProductController();
  }
  renderInicio = (req, res) => {
    res.redirect("/login");
  };

  renderChat = (req, res) => {
    res.render("chat", { title: "Chat" });
  };

  renderLogin = (req, res) => {
    res.render("login", { title: "Login" });
  };

  renderRegister = (req, res) => {
    res.render("register", { title: "Registro" });
  };

  renderRestore = (req, res) => {
    res.render("restore");
  };

  renderCurrent = (req, res) => {
    if (req.cookies[config.tokenCookieName]) {
      res.render("current", { title: "Perfil de usuario", user: req.user });
    } else {
      res.status(401).json({
        error: "Invalid jwt",
      });
    }
  };

  renderProducts = (req, res) => {
    if (!req.cookies[config.tokenCookieName]) {
      return res.redirect("/login");
    }
    const params = req.query;
    const user = req.user;
    const urlParams = new URLSearchParams(params);
    const url = `http://localhost:8080/api/products?${urlParams.toString()}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          res.render("products", {
            data,
            title: "Listado de productos",
            user,
          });
        } else {
          res.status(500).send("Error al obtener los productos");
        }
      })
      .catch((err) =>
        res.status(500).send(`Error en el fetch de productos. ${err}`)
      );
  };

  renderCart = (req, res) => {
    if (!req.cookies[config.tokenCookieName]) {
      return res.redirect("/login");
    }
    const cid = req.params.cid;
    fetch(`http://localhost:8080/api/carts/${cid}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const products = data.payload.products;
          res.render("carts", { products, title: "Carrito" });
        } else {
          res.status(500).send("Error al acceder al carrito");
        }
      })
      .catch((err) =>
        res.status(500).send(`Error. ${err}`)
      );
  };
}
