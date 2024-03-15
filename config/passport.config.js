import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { createHash, isValidPassword } from '../utils.js';
import { LoginManagerMongo } from '../dao/manejadores/LoginManagerMongo.js';

const userManager = new LoginManagerMongo();

// Configuración de la estrategia 'signup'
passport.use('signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // Permite pasar el objeto de solicitud a la devolución de llamada
}, async (req, email, password, done) => {
    try {
        const { first_name, last_name } = req.body;
        const hashedPassword = createHash(password);
        const newUser = await userManager.newUser({ first_name, last_name, email, password: hashedPassword });
        return done(null, newUser); // Pasar el nuevo usuario al callback de éxito
    } catch (error) {
        return done(error); // Pasar cualquier error al callback de error
    }
}));

passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await userManager.byEmail(email);
        if (!user) {
            return done(null, false, { message: 'Usuario no encontrado' });
        }
        if (!isValidPassword(user, password)) {
            return done(null, false, { message: 'Contraseña incorrecta' });
        }
        return done(null, user); // Pasar el usuario autenticado al callback de éxito
    } catch (error) {
        return done(error); // Pasar cualquier error al callback de error
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userManager.byId(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

export default passport;