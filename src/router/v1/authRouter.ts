import { Router } from 'express';
import AuthController from '../../controller/auth.controller';

const router: Router = Router();

const authController = new AuthController();

router.post('/login/manager', authController.managerLogin);
router.post('/login/driver', authController.driverLogin);

export default router;