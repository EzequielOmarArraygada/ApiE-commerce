import passport from "passport";
import jwt from "passport-jwt";
import passportLocal from "passport-local";
import utils from "../utils.js";
import { UserManagerMongo } from '../dao/services/managers/UserManagerMongo.js';
import CustomError from "../services/errors/CustomError.js";
import EError from "../services/errors/enums.js";
import { generateErrorInfo } from "../services/errors/info-user.js";

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
    passport.use("singup", new LocalStrategy(
        { passReqToCallback: true, usernameField: "email" },
        async (req, email, password, done) => {
            const { first_name, last_name, age } = req.body;

            if (!first_name || !last_name || !age) {
                const err = new CustomError(
                    "Error al crear el usuario",
                    generateErrorInfo({ first_name, last_name, age }),
                    "Error al crear el usuario",
                    EError.INVALID_TYPES_ERROR
                );
                return done(err);
            }

            try {
                let user = await u.findByEmail(email);
                if (user) {
                    req.logger.fatal(
                        `Usuario existente!, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
                    )
                    
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
                return done(`Error: ${error}`);
            }
        }
    ));
    
    //JWT
    passport.use(
        'login', 
        new JWTStrategy(
            {
                jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
                secretOrKey: '12345678',
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
