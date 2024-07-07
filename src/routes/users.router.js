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

UsersRouter.post('/signup', passport.authenticate('signup', { 
    failureRedirect: '/failregister', 
    failureMessage: true 
}), postSignup);
UsersRouter.post('/login', postLogin);
UsersRouter.get('/signout', passportCall('login', 'user'), getSignOut);
UsersRouter.put('/premium/:uid', passportCall('login', 'admin'), togglePremium);

export default UsersRouter;
