import { Router } from "express";
import login from "../api/auth/login";
import changePassword from "../api/auth/changePassword";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();

router.post("/login", login);
router.post("/change-password", [checkJwt], changePassword);

export default router;