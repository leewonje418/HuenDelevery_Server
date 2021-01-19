import { Router } from 'express';
import userRouter from './userRouter'
import authRouter from './authRouter'
import deliveryRouter from './deliveryRouter'
import uploadRouter from './uploadRouter'

const router: Router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/delivery', deliveryRouter);
router.use('/upload', uploadRouter);

export default router;