import { Router } from 'express';
import userRouter from './userRouter'

const router: Router = Router();

router.use('/auth', authReouter);
router.use('/user', userRouter);

export default router;