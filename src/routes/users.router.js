import { Router } from 'express';
import passport from 'passport';
import { UserController } from '../controllers/users.controller.js';
import utils from '../utils.js';

const { passportCall } = utils;
const UsersRouter = Router();
const {
    postSignup,
    postLogin,
    getSignOut,
    togglePremium,
} = new UserController();

/**
 * @swagger
 * /api/sessions/signup:
 *   post:
 *     summary: Registro de un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: "test@example.com"
 *               password: "password"
 *     responses:
 *       200:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Error en el registro
 */
UsersRouter.post('/signup', passport.authenticate('signup', { 
    failureRedirect: '/failregister', 
    failureMessage: true 
}), postSignup);

/**
 * @swagger
 * /api/sessions/login:
 *   post:
 *     summary: Inicia sesión de usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: "test@example.com"
 *               password: "password"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       401:
 *         description: Credenciales inválidas
 */
UsersRouter.post('/login', postLogin);

/**
 * @swagger
 * /api/sessions/signout:
 *   get:
 *     summary: Cierra sesión de usuario
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente
 *       401:
 *         description: Usuario no autenticado
 */
UsersRouter.get('/signout', passportCall('login', 'user'), getSignOut);

/**
 * @swagger
 * /api/sessions/premium/{uid}:
 *   put:
 *     summary: Alterna el rol del usuario entre 'user' y 'premium'
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: uid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Rol del usuario cambiado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *       404:
 *         description: Usuario no encontrado
 */
UsersRouter.put('/premium/:uid', passportCall('login', 'admin'), togglePremium);

export default UsersRouter;