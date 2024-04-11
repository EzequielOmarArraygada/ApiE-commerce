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
