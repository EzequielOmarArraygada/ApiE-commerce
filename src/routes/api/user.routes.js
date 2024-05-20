import { Router } from "express";
import UserController from "../../controllers/user.controller.js";

const router = Router();
const { getUsers, createUser } = new UserController();

router.get("/", getUsers);

router.post("/", createUser);

app.get('/loggerTest', (req, res) => {
    logger.debug('Mensaje de debug');
    logger.http('Mensaje http');
    logger.info('Mensaje info');
    logger.warning('Mensaje warning');
    logger.error('Mensaje error');
    logger.fatal('Mensaje fatal');
    res.send('Mensajes de log enviados');
});

export default router;
