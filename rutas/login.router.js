import { Router } from "express";
import { LoginManagerMongo } from "../dao/manejadores/LoginManagerMongo.js";
import passport from "../config/passport.config.js"
import Swal from 'sweetalert2';


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


loginRouter.get('/login/ghcb', passport.authenticate('github', {
    successRedirect: '/products', 
    failureRedirect: '/login', // 
}));

loginRouter.get('/login', (req, res) => {
    if (req.session.signupSuccess) {
        Swal.fire({
            title: 'Usuario creado exitosamente',
            icon: 'success'
        });
        req.session.signupSuccess = false; // Reiniciar la bandera después de mostrar el mensaje
    }
    res.render('login');
});

// Mostrar cartel de "Inicio de sesión correcto"
loginRouter.get('/products', (req, res) => {
    if (req.session.loginSuccess) {
        Swal.fire({
            title: 'Inicio de sesión correcto',
            icon: 'success'
        });
        req.session.loginSuccess = false; // Reiniciar la bandera después de mostrar el mensaje
    }
    // Renderizar la vista de productos
    res.render('products');
});



export default loginRouter;