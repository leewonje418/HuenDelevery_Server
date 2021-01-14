import { Router } from 'express';
import UserController from '../../controller/user.controller';
import authMiddleware from '../../lib/middleware/auth';

const router: Router = Router();

const userController = new UserController();

router.post('/login/manager', userController.managerLogin);
// router.post('/login/driver', userCtrl.driverLogin);
// router.get('/customers', authMiddleware.managerAuth, userCtrl.getAllCustomers);
// router.get('/drivers', authMiddleware.managerAuth, userCtrl.getAllDrivers);

export default router;