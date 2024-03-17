import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { createHash, isValidPassword } from '../utils.js';
import { LoginManagerMongo } from '../dao/manejadores/LoginManagerMongo.js';

const userManager = new LoginManagerMongo();

passport.use('signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true 
}, async (req, email, password, done) => {
    try {
        const { first_name, last_name } = req.body;
        const hashedPassword = createHash(password);
        const newUser = await userManager.newUser({ first_name, last_name, email, password: hashedPassword });
        return done(null, newUser); 
    } catch (error) {
        return done(error); 
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
        return done(null, user); 
    } catch (error) {
        return done(error); 
    }
}));

passport.use('github', new GitHubStrategy({
    clientID: "Iv1.89f30c313d658d3b",
    clientSecret: 'a5696230a38a7ac70fc29b5f43528ea0b22cf9c4',
    callbackURL: "http://localhost:8080/login/ghcb"
},
async (accessToken, refreshToken, profile, done) => {
    try {
        console.log("Perfil de GitHub:", profile); 
    let email;
    if (profile.email && profile.email.length > 0) {
        email = profile.emails[0].value;
    } else {
        throw new Error('Correo electrónico no proporcionado por GitHub');
    }
    let user = await userManager.byEmail(email);
    if (!user) {
        user = await userManager.newUser({
        first_name: profile.displayName,
        last_name: profile.company,
        email: profile.email[0].value,
        });
    }
    return done(null, user); 
    } catch (error) {
    return done(error); 
    }
}
));

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