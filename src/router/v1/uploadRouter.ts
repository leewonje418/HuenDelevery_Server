import { Router } from 'express';
import DeliveryController from '../../controller/delivery.controller';
import { UploadController } from '../../controller/upload.controller';
import multerMiddleware from '../../lib/middleware/multer.middleware';

const router: Router = Router();

const uploadController = new UploadController();

router.post('/', multerMiddleware, uploadController.upload);

export default router;