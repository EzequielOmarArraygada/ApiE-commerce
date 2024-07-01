import { Router } from "express";
import passport from "passport";
import { UserController } from '../controllers/users.controller.js';

const UsersRouter = Router();
const {
    postSignup,
    postLogin,
    getSignOut,
} = new UserController();

UsersRouter.post("/signup", passport.authenticate("signup", { 
    failureRedirect: "/failregister", 
    failureMessage: true 
}), postSignup);
UsersRouter.post('/login', postLogin);
UsersRouter.get("/logout", getSignOut);

export default UsersRouter;
