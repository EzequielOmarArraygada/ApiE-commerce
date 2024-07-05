import express from 'express';
import { passportCall } from '../../utils.js';
import SessionsController from '../../controllers/sessions.controller.js';

const router = express.Router();
const { register, login, logout, restore } = new SessionsController();

router.post('/register', passportCall('register'), register);

router.post('/login', passportCall('login'), login);

router.get('/logout', logout);

router.post('/restore', restore);

export default router;
