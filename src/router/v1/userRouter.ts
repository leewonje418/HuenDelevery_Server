import { Router } from 'express';
import UserController from '../../controller/user.controller';
import authMiddleware from '../../lib/middleware/auth';

const router: Router = Router();

const userController = new UserController();

router.get('/customer', authMiddleware.managerAuth, userController.getCustomers);
router.get('/driver', authMiddleware.managerAuth, userController.getDrivers);

export default router;