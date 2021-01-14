import { Router } from 'express';
import { UserCtrl } from '../../controller/userCtrl';
import authMiddleware from '../../lib/middleware/auth';

const router: Router = Router();

const userCtrl = new UserCtrl;

router.post('/login/manager', userCtrl.managerLogin);
router.post('/login/driver', userCtrl.driverLogin);
router.get('/check/customer', authMiddleware.managerAuth, userCtrl.getAllCustomers);
router.get('/check/driver', authMiddleware.managerAuth, userCtrl.getAllDrivers);

export default router;