import { Router } from 'express';
import { UserCtrl } from '../../controller/userCtrl';

const router: Router = Router();

const userctrl = new UserCtrl;

router.post('/login/manager', userctrl.managerLogin);
router.post('/login/driver', userctrl.driverLogin);
router.get('/check/customer', userctrl.customerGetAll);
router.get('/check/driver', userctrl.driverGetAll);

export default router;