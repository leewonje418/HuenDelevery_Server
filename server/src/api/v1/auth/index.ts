import { Router } from "express";
import login from "./auth.ctrl/login";
import changePassword from "./auth.ctrl/changePassword";

const router = Router();

router.post("/login", login);
router.post("/changePassword", changePassword);

export default router;