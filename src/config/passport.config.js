import jwt from "passport-jwt";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import userModel from "../dao/models/user.model.js";
import config from "./config.js";
import { createHash, isValidPassword } from "../utils.js";
import CartService from "../services/cart.service.js";
import UserService from "../services/user.service.js";

const ExtractJwt = jwt.ExtractJwt;
const JwtStrategy = jwt.Strategy;
const LocalStrategy = local.Strategy;

const userService = new UserService();
const cartService = new CartService();

const initializePassport = (passport) => {
  const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies[config.tokenCookieName];
    }

    return token;
  };

  const options = {
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: config.privateKey,
  };

  passport.use(
    "jwt",
    new JwtStrategy(options, (jwt_payload, done) => {
      try {
        return done(null, jwt_payload, { message: "Concedido" });
      } catch (error) {
        return done(null, null, {
          message: "No se pudo autentificar" + error,
        });
      }
    })
  );

  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { name, lastname, email, age } = req.body;
        //si faltan campos, se manda un mensaje de error
        if (!name || !lastname || !email || !age || !password) {
          return done(null, false, {
            message: "Todos los campos son obligatorios",
          });
        }

        try {
          let user = await userService.getUserByEmail(username);
          if (user) {
            return done(null, false, { message: "Usuario existente" });
          }

          const cart = await cartService.createCart();
          user = {
            name,
            lastname,
            age,
            email,
            cart: cart._id,
            password: createHash(password),
          };
          if (
            username === config.adminName &&
            password === config.adminPassword
          ) {
            user.role = "admin";
          }
          const userCreated = await userService.createUser(user);
          return done(null, userCreated);
        } catch (error) {
          return done(null, false, {
            message: "No se pudo crear el usuario " + error,
          });
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await userService.getUserByEmail(username);
          if (!user) {
            return done(null, false, { message: "Usuario inexistente" });
          }
          if (!isValidPassword(user, password)) {
            return done(null, false, { message: "Contraseña incorrecta" });
          }
          return done(null, user);
        } catch (error) {
          return done(null, false, { message: "No se pudo logear" + error });
        }
      }
    )
  );


  passport.serializeUser(async (user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      let user = await userModel.findById(id);
      done(null, user);
    } catch (error) {
      done("Error " + error);
    }
  });
};

export default initializePassport;
