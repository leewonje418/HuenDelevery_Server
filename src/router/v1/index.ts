import { Router } from 'express';
import userRouter from './userRouter'
import authRouter from './authRouter'

const router: Router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);

export default router;