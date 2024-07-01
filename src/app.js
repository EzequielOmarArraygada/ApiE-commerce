<<<<<<< Updated upstream
import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import http from "http";
import __dirname from "./utils.js";
import path from "path";
import mongoose from "mongoose";
import MessageManager from "./dao/messageManager.js";
import config from "./config/config.js";
import cookieParser from "cookie-parser";
import initializePassport from "./config/passport.config.js";
import passport from "passport";
import cors from "cors";
import appRouter from "./routes/index.routes.js";


const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("myParser"));


mongoose
  .connect(config.mongoURL)
  .then(() => console.log("Conectado a la DB"))
  .catch((error) => console.error("Error al conectarse a la DB", error));

const httpServer = http.createServer(app);
httpServer.listen(PORT, () =>
  console.log(`Servidor en el puerto ${PORT}`)
);

const io = new Server(httpServer);

initializePassport(passport);
app.use(passport.initialize());
app.use(cors());

app.engine(".hbs", handlebars.engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", path.resolve(__dirname + "/views"));
app.use(express.static(__dirname + "/public"));

app.use(appRouter);

const messageManager = new MessageManager();
const users = {};

io.on("connection", (socket) => {
  console.log("Un usuario se ha conectado");
  socket.on("newUser", (userEmail) => {
    users[socket.id] = userEmail;
    io.emit("userConnected", userEmail);
  });

  socket.on("chatMessage", (message) => {
    const userEmail = users[socket.id];

    messageManager
      .addMessage(userEmail, message)
      .then(io.emit("message", { userEmail, message }))
      .catch((error) => io.emit("error", error));
  });

  socket.on("disconnect", () => {
    const userEmail = users[socket.id];
    delete users[socket.id];
    io.emit("userDisconnected", userEmail);
  });
});
=======
import express from 'express';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import handlebars from 'express-handlebars';
import path from 'path';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import initializePassport from './config/passport.config.js';
import utils from './utils.js';
import router from './routes/index.js';
import dotenv from 'dotenv';
import UserDTO from './dao/dto/user.dto.js';
import { Server } from 'socket.io';
import { chatMM } from './routes/chat.router.js';
import errorHandler from './middlewares/errors/index.js';
import { addLogger } from './utils/logger.js';
import swaggerConfig from "./config/swagger.js";


dotenv.config();

const { passportCall } = utils;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = config.PORT || 8080;
const mongooseUrl = process.env.MONGO_URL;

app.use(addLogger);

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, '/views'));
app.set('view engine', "handlebars");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use('/api', authenticateToken, routes);

dbConnection();
swaggerConfig(app);

app.use(session({
    store: MongoStore.create({
        mongoUrl: mongooseUrl,
        ttl: 60 * 60
    }),
    secret: process.env.SESSION_SECRET || "12345679",
    resave: false,
    saveUninitialized: false
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    if (req.url === '/favicon.ico') {
        res.status(204).end();
    } else {
        next();
    }
});

// Actualiza la ruta de logout
app.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            req.logger.error(`Error al cerrar sesión: ${err.message}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
            return next(err);
        }
        req.session.destroy((err) => {
            if (err) {
                req.logger.error(`Error al destruir la sesión: ${err.message}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
                return res.status(500).send({ status: "error", message: "Error al cerrar sesión." });
            }
            req.logger.info(`Sesión cerrada exitosamente, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
            res.redirect("/login");
        });
    });
});

app.get('/current', passportCall('login', 'admin'), (req, res) => {
    if (req.isAuthenticated()) {
        const userDTO = new UserDTO(req.user);
        res.render('current', { user: userDTO });
    } else {
        res.redirect('/login');
    }
});

app.get("/failregister", (req, res) => {
    req.logger.error(`Fallo en el registro!, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
    res.status(400).send({ error: "Fallo en el registro" });
});

app.get("/faillogin", (req, res) => {
    req.logger.error(`Login fallido!, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
    res.status(400).send({ error: "Fallo en el login" });
});

app.use(router);

app.use((req, res, next) => {
    res.status(404).json({
        error: "Ruta no encontrada",
    });
});

app.use(errorHandler);

const environment = async () => {
    try {
        await mongoose.connect(mongooseUrl);
        console.log("Conectado a la base de datos");

        const httpServer = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

        const io = new Server(httpServer);

        const users = {};

        io.on("connection", (socket) => {
            socket.on("newUser", (username) => {
                users[socket.id] = username;
                io.emit("userConnected", username);
            });

            socket.on("chatMessage", async (data) => {
                const { username, message } = data;
                try {
                    await chatMM.addChat(username, message);
                    io.emit("message", { username, message });
                } catch (error) {
                    console.error("Error al procesar el mensaje del chat!", error);
                }
            });

            socket.on("disconnect", () => {
                const username = users[socket.id];
                delete users[socket.id];
                io.emit("userDisconnected", username);
            });
        });
    } catch (error) {
        console.error("Error al conectarse", error);
    }
};

environment();

export default app;
>>>>>>> Stashed changes
