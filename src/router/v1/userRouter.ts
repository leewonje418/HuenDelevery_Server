import { Router } from 'express';
import { UserCtrl } from '../../controller/userCtrl';
import authMiddleware from '../../lib/middleware/auth';

const router: Router = Router();

const userCtrl = new UserCtrl;

router.post('/login/manager', userCtrl.managerLogin);
router.post('/login/driver', userCtrl.driverLogin);
router.get('/customers', authMiddleware.managerAuth, userCtrl.getAllCustomers);
router.get('/drivers', authMiddleware.managerAuth, userCtrl.getAllDrivers);

export default router;