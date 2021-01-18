import { Router } from 'express';
import DeliveryController from '../../controller/delivery.controller';
import { authDriver, authManager } from '../../lib/middleware/auth.middleware';

const router: Router = Router();

const deliveryController = new DeliveryController();

router.get('/completed', authManager, deliveryController.getCompletedDeliveries);
router.get('/delivering', authManager, deliveryController.getDeliveringDeliveries);
router.post('/', authManager, deliveryController.createDeliveries);
router.post('/single', authManager, deliveryController.createDelivery);
router.post('/start/:deliveryIdx', authDriver, deliveryController.startDelivery);
router.post('/end/:deliveryIdx', authDriver, deliveryController.endDelivery);

export default router;