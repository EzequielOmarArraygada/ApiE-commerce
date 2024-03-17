import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { createHash, isValidPassword, randomPassword } from '../utils.js';
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
        req.session.signupSuccess = true;
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
        req.session.loginSuccess = true;
        return done(null, user); 
    } catch (error) {
        return done(error); 
    }
}));

passport.use(new GitHubStrategy({
    clientID: "Iv1.89f30c313d658d3b",
    clientSecret: 'd1671d6f951c255745d95f1577576dd1667087e5',
    callbackURL: 'http://localhost:8080/login/ghcb'
},
async (accessToken, refreshToken, profile, done) => {
    try {
        console.log("Perfil de GitHub:", profile); 
        console.log(profile.emails[0].value); 

        let email;
        if (profile.emails && profile.emails.length > 0) {
            email = profile.emails[0].value;
        } else {
            throw new Error('Correo electrónico no proporcionado por GitHub');
        }
        let user = await userManager.byEmailGH(email);
        if (!user) {

            user = await userManager.newUser({
                first_name: profile._json.name,
                last_name: profile._json.email, 
                email: profile._json.email,
                password: randomPassword, 
                role: 'user' 
            });
            console.log(user);
        }
        return done(null, user);
    } catch (error) {
        return done(error);
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