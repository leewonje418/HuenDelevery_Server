import { Router } from 'express';
import userContoller from './userRouter'

const router: Router = Router();

router.use('/user', userContoller);

export default router;