import { UserManagerMongo } from '../dao/services/managers/UserManagerMongo.js';
import jwt from "jsonwebtoken";
import utils from "../utils.js";
import UserDTO from '../dao/dto/user.dto.js'; 

export class UserController {
    constructor(){
        this.usersService = new UserManagerMongo();
    }

    generatePasswordResetToken = async (email) => {
        const user = await this.usersService.findByEmail(email);

        if (!user) {
            throw new Error('No se pudo encontrar este usuario');
        }

        const token = crypto.randomBytes(20).toString('hex');

        const expires = new Date();
        expires.setHours(expires.getHours() + 1);

        user.passwordResetToken = token;
        user.passwordResetExpires = expires;

        await this.usersService.update(user);

        return token;
    }

    postSignup = async (req, res) => {
        res.redirect("/login"); 
    }
    
    postLogin = async (req, res) => {
        const { email, password } = req.body;
        try {
            let user = await this.usersService.findByEmail(email);
            console.log('Usuario encontrado exitosamente:', user);
            if (!user) {
                return res
                    .status(401)
                    .send({ status: 'error', message: 'El usuario no existe' });
            }
            const isValid = utils.isValidatePassword(user, password);
            console.log('Contraseña correcta', isValid);
    
            if (!isValid) {
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
                password: user.password
            }
    
            const token = jwt.sign(tokenUser, "12345679", {expiresIn: "1d"});
            console.log('Token JWT generado:', token);
    
            res
                .cookie("coderCookieToken", token, {
                    maxAge: 60 * 60 * 1000 * 24,
                    httpOnly: true,
                })
                .send({status: "success", user: userDTO});
                
        } catch (error) {
            console.error(error); 
            res.status(500).send({ status: "error", message: "Error en el servidor" });
        }
    }
    
    getSignOut = async (req, res) => {
        req.session.destroy(() => {
            res.redirect("/login");
        });
    }

}

