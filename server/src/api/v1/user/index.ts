import { Router, NextFunction } from 'express';
import deleteUser from "./user.ctrl/deleteUser";
import editUser from "./user.ctrl/editUser";
import getAll from "./user.ctrl/getAll";
import getOneById from "./user.ctrl/getOneById";
import signUp from "./user.ctrl/signUp";

const router = Router();

router.get("/deleteUser", deleteUser);
router.get("/editUser", editUser);
router.get("/getAll", getAll);
router.get("/getOneById", getOneById);
router.post("/signUp", signUp);

export default router;