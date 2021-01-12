import { Router } from "express";
import userContoller from "./userContoller"

const router = Router();

router.use("/user", userContoller);

export default router;