import bcrypt from "bcrypt"
import passport from "passport"

const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
const isValidatePassword = (user, password) => bcrypt.compareSync(password, user.password)

const passportCall = (strategy, role) => {
    return (req, res, next) => {
        passport.authenticate(strategy, function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res
                    .status(401)
                    .send({ error: info.messages ? info.messages : info.toString()});
            }

            console.log('Usuario autenticado:', user);
            console.log('Rol del usuario:', user.role); 

            if (user.role !== role) {
                console.log('Acceso denegado. Rol de usuario incorrecto.');
                return res.status(403).send({ error: 'Acceso denegado. Rol de usuario incorrecto.' });
            }

            req.user = user;
            next();
                
        })(req, res, next);
    }
}

export default { createHash, isValidatePassword, passportCall };