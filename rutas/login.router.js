import { Router } from "express";
import { LoginManagerMongo } from "../dao/manejadores/LoginManagerMongo.js";
import passport from "../config/passport.config.js"
import Swal from 'sweetalert2';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config/jwt.config.js';


const loginRouter = Router();
const userManager = new LoginManagerMongo();


loginRouter.get("/", async (req, res) => {
    res.redirect("/login");
});

loginRouter.get("/signup", async (req, res) => {
    res.render('signup');
});

loginRouter.get("/login", async (req, res) => {
    if (req.session.signupSuccess) {
        Swal.fire({
            title: 'Usuario creado exitosamente',
            icon: 'success'
        });
        req.session.signupSuccess = false;
    }
    if (req.session.loginSuccess) {
        Swal.fire({
            title: 'Inicio de sesión correcto',
            icon: 'success'
        });
        req.session.loginSuccess = false;
    }
    res.render('login');
});

loginRouter.post("/signup", passport.authenticate('signup', {
    successRedirect: '/login?signupSuccess=true', 
    failureRedirect: '/signup', 
    failureFlash: true 
}));

loginRouter.post("/login", passport.authenticate('login', { session: false }), (req, res) => {
    try {

        const token = jwt.sign({ id: req.user._id }, jwtSecret, { expiresIn: '1h' });


        res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 }); 


        res.redirect('/products?loginSuccess=true');
    } catch (error) {
        console.error("Error en el inicio de sesión:", error);
        res.status(500).send({ message: 'Error en el servidor' });
    }
});

loginRouter.post("/logout", (req, res) => {
    req.logout();  
    res.redirect('/'); 
    res.clearCookie('jwt');
});


loginRouter.get('/login/ghcb', passport.authenticate('github', {
    successRedirect: '/products', 
    failureRedirect: '/login', 
}));


export default loginRouter;