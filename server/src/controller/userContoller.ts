import { Router } from "express";
import login from "../service/userService/managerLogin";
// import changePassword from "../api/v1/auth/auth.ctrl/changePassword";

const router = Router();

router.post("/login", login);

export default router;