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

            req.logger.info(
                `Usuario autenticado: ${user}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
            )
            req.logger.debug(
                `Rol de usuario: ${user.role}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
            ) 

            if (user.role !== role) {
                req.logger.warning(
                    `Acceso denegado. Rol de usuario incorrecto, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
                )
                return res.status(403).send({ error: 'Acceso denegado. Rol de usuario incorrecto.' });
            }

            req.user = user;
            next();
                
        })(req, res, next);
    }
}

export default { createHash, isValidatePassword, passportCall };