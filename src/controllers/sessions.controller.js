import jwt from "jsonwebtoken";
import config from "../config/config.js";
import UserService from "../services/user.service.js";
import { createHash } from "../utils.js";

export default class SessionsController {
  constructor() {
    this.userService = new UserService();
  }

  register = (req, res, next) => {
    res.status(200).send({
      success: true,
      message: "Usuario creado",
    });
  };

  login = (req, res, next) => {
    const userToken = {
      name: req.user.name,
      lastname: req.user.lastname,
      email: req.user.email,
      age: req.user.age,
      role: req.user.role,
      cart: req.user.cart,
    };
    const token = jwt.sign(userToken, config.privateKey, {
      expiresIn: "24h",
    });

    res
      .cookie(config.tokenCookieName, token, {
        maxAge: 60 * 60 * 1000 * 24,
        httpOnly: true,
      })
      .send({
        success: true,
      });
  };

  logout = (req, res) => {
    if (req.cookies[config.tokenCookieName]) {
      res.clearCookie(config.tokenCookieName).status(200).json({
        success: true,
        message: "Sesion cerrada",
      });
    } else {
      res.status(401).json({
        error: "Error",
      });
    }
  };

  restore = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res.status(400).send({
          status: "error",
          error: "Todos los campos son obligatorios",
        });

      const user = await this.userService.getUserByEmail(email);

      if (!user)
        return res
          .status(401)
          .send({ status: "error", error: "Usuario incorrecto" });

      user.password = createHash(password);

      await this.userService.updatePassword(user);

      res.status(200).send({
        success: true,
        message: "Contraseña actualizada",
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: `Error al restablecer contraseña. ${error}`,
      });
    }
  };
}
