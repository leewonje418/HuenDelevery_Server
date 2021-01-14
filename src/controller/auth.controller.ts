import { Request, Response } from "express";
import Role from "../enum/Role";
import httpErrorHandler from "../lib/handler/httpErrorHandler";
import LoginRequest from "../request/auth/login.request";
import UserService from "../service/user.service";

export default class AuthController {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async managerLogin(req: Request, res: Response) {
    try {
      const loginRequest = new LoginRequest(req.body);
      await loginRequest.validate();

      const token = this.userService.login(Role.MANAGER, loginRequest);

      res.status(200).json({
        message: '로그인 성공',
        data: {
          'x-access-token': token,
        },
      });
    } catch (err) {
      httpErrorHandler(res, err);
    }
  }

  async driverLogin(req: Request, res: Response) {
    try {
      const loginRequest = new LoginRequest(req.body);
      await loginRequest.validate();

      const token = this.userService.login(Role.DRIVER, loginRequest);

      res.status(200).json({
        message: '로그인 성공',
        data: {
          'x-access-token': token,
        },
      });
    } catch (err) {
      httpErrorHandler(res, err);
    }
  }
}