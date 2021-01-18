import { Router } from 'express';
import DeliveryController from '../../controller/delivery.controller';

const router: Router = Router();

const deliveryController = new DeliveryController();

//router.post('/date/deliverys', deliveryController.getDeliverys);
//router.post('/date/during', deliveryController);
//router.post('/date/finish', deliveryController);
router.post('/delivery/start', deliveryController.startDelivery);
router.post('/delivery/end', deliveryController.endDelivery);

export default router;