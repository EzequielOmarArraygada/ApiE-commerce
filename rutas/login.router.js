import { Router } from "express";
import { LoginManagerMongo } from "../dao/manejadores/LoginManagerMongo.js";
import passport from "../config/passport.config.js"

const loginRouter = Router();
const userManager = new LoginManagerMongo();


loginRouter.get("/", async (req, res) => {
    res.redirect("/login");
});

loginRouter.get("/signup", async (req, res) => {
    res.render('signup');
});

loginRouter.get("/login", async (req, res) => {
    res.render('login');
});

loginRouter.post("/signup", passport.authenticate('signup', {
    successRedirect: '/login', 
    failureRedirect: '/signup', 
    failureFlash: true 
}));

loginRouter.post("/login", passport.authenticate('login', {
    successRedirect: '/products', 
    failureRedirect: '/login', 
    failureFlash: true 
}));

loginRouter.post("/logout", (req, res) => {
    req.logout();  
    res.redirect('/'); 
});

export default loginRouter;