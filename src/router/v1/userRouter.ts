import { Router } from 'express';
import UserController from '../../controller/user.controller';
import { authManager } from '../../lib/middleware/auth.middleware';

const router: Router = Router();

const userController = new UserController();

router.get('/customer', authManager, userController.getCustomers);
router.get('/driver', authManager, userController.getDrivers);

export default router;