import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

import listAll from "../api/user/getAll";
import signUp from "../api/user/signUp";
import getOneById from "../api/user/getOneById";
import editUser from "../api/user/editUser";
import deleteUser from "../api/user/deleteUser";

const router = Router();

router.get("/", [checkJwt, checkRole(["ADMIN"])], listAll);

router.get(
  "/:id([0-9]+)",
  [checkJwt, checkRole(["ADMIN"])],
  getOneById
);

router.post("/", signUp);

router.patch(
  "/:id([0-9]+)",
  [checkJwt, checkRole(["ADMIN"])],
  editUser
);

router.delete(
  "/:id([0-9]+)",
  [checkJwt, checkRole(["ADMIN"])],
  deleteUser
);

export default router;