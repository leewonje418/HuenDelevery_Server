import { Router } from 'express';
import { UserCtrl } from '../../controller/userCtrl';

const router: Router = Router();

const userctrl = new UserCtrl;

router.post('/login/manager', userctrl.checkManager);
router.post('/login/driver', userctrl.checkDriver);

export default router;