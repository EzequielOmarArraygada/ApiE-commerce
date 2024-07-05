import { UserManagerMongo } from '../dao/services/managers/UserManagerMongo.js';
import jwt from 'jsonwebtoken';
import utils from '../utils.js';
import UserDTO from '../dao/dto/user.dto.js';

export class UserController {
    constructor(){
        this.usersService = new UserManagerMongo();
    }

    postSignup = async (req, res) => {
        res.redirect('/login'); 
    }
    
    postLogin = async (req, res) => {
        const { email, password } = req.body;
        try {
            let user = await this.usersService.findByEmail(email);
            req.logger.debug(
                `Usuario encontrado: ${user ? user.email : 'No encontrado'}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
            );
            
            if (!user) {
                req.logger.warn(
                    `Intento de inicio de sesión con un usuario no existente: ${email}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
                );
                return res
                    .status(401)
                    .send({ status: 'error', message: 'El usuario no existe.' });
            }
            const isValid = utils.isValidatePassword(user, password);
            req.logger.debug(
                `Verificación de contraseña: ${isValid ? 'exitosa' : 'fallida'}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
            );
    
            if (!isValid) {
                req.logger.warn(
                    `Intento de inicio de sesión fallido para el usuario: ${email}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
                );
                return res
                    .status(401)
                    .redirect('/faillogin');
            }
    
            const userDTO = new UserDTO(user);
            const tokenUser = {
                _id: user._id, 
                email: user.email,
                first_name: user.first_name,
                role: user.role,
                cart: user.cart,
            };
    
            const token = jwt.sign(tokenUser, '12345678', { expiresIn: '1d' });
            req.logger.debug(
                `Token JWT generado exitosamente: ${token}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
            );
    
            res
                .cookie('coderCookieToken', token, {
                    maxAge: 60 * 60 * 1000 * 24,
                    httpOnly: true,
                })
                .send({ status: 'success', user: userDTO });
                
        } catch (error) {
            req.logger.error(
                `Error al procesar el inicio de sesión: ${error.message}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
            );
            res.status(500).send({ status: 'error', message: 'Error interno del servidor.' });
        }
    }
    
    getSignOut = async (req, res) => {
        try {
            req.logout(); 
            res.clearCookie('coderCookieToken').redirect('/login');
        } catch (error) {
            console.error(`Error al cerrar sesión: ${error.message}`);
            res.status(500).send({ status: 'error', message: 'Error al cerrar sesión.' });
        }
    }
}
