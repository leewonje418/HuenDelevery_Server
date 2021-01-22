import { Router } from 'express';
import DeliveryController from '../../controller/delivery.controller';
import { authDriver, authManager } from '../../lib/middleware/auth.middleware';

const router: Router = Router();

const deliveryController = new DeliveryController();

// 날짜를 통해 조회
router.get('/', authManager, deliveryController.getDeliveriesByDate);
router.get('/driver/completed/:id', authManager, deliveryController.getTodayDeliveryByDriver);
router.get('/my', authDriver, deliveryController.getMyDeliveries);
router.get('/my/completed', authDriver, deliveryController.getTodayMyCompletedDeliveries);
router.get('/delivering', authManager, deliveryController.getDeliveringDeliveries);
router.get('/driver/distance/:id', authManager, deliveryController.getDriverTodayDriveDistance);
router.post('/', authManager, deliveryController.createDeliveries);
router.post('/order', authDriver, deliveryController.orderDelivery);
router.post('/single', authManager, deliveryController.createDelivery);
router.post('/end/:deliveryIdx', authDriver, deliveryController.endDelivery);

export default router;