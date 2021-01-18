import { Router } from 'express';
import DeliveryController from '../../controller/delivery.controller';
import { authDriver } from '../../lib/middleware/auth.middleware';

const router: Router = Router();

const deliveryController = new DeliveryController();

//router.post('/date/deliverys', deliveryController.getDeliverys);
//router.post('/date/during', deliveryController);
//router.post('/date/finish', deliveryController);
router.post('/delivery/start', authDriver, deliveryController.startDelivery);
router.post('/delivery/end', authDriver, deliveryController.endDelivery);

export default router;