import passport from "passport";
import jwt from "passport-jwt";
import passportLocal from "passport-local";
import utils from "../utils.js";
import { UserManagerMongo } from '../dao/services/managers/UserManagerMongo.js';

const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const u = new UserManagerMongo();

const initializePassport = () => {

    const cookieExtractor = (req) => {
        let token = null;
        if (req && req.cookies) {
            token = req.cookies["coderCookieToken"];
        }
        return token;
    };

    //Local
    passport.use("signup", new LocalStrategy(
        { passReqToCallback: true, usernameField: "email" },
        async (req, email, password, done) => {
            const { first_name, last_name, age } = req.body;

            try {
                let user = await u.findByEmail(email);
                if (user) {
                    console.log("Usuario existente");
                    return done(null, false);
                }

                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: utils.createHash(password),
                };

                let result = await u.createOne(newUser);
                return done(null, result);

            } catch (error) {
                return done(`${error}`);
            }
        }
    ));
    
    //JWT
    passport.use(
        'login', 
        new JWTStrategy(
            {
                jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
                secretOrKey: '12345679',
            }, 
    
            (jwt_payload, done) => {
                try {
                    return done(null, jwt_payload);
                } catch (error) {
                    return done(error);
                }
            }   
        )
    )

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await u.findById(id);
        done(null, user);
    });
};


export default initializePassport;
