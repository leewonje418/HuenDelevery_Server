import { Request, Response } from 'express';
import Role from '../enum/Role';
import httpErrorHandler from '../lib/handler/httpErrorHandler';
import LoginRequest from '../request/auth/login.request';
import CustomerService from '../service/customer.service';
import DriverService from '../service/driver.service';
import ManagerService from '../service/manager.service';

export default class AuthController {
  private readonly driverService: DriverService;
  private readonly managerService: ManagerService;

  constructor() {
    this.driverService = new DriverService();
    this.managerService = new ManagerService();
  }

  managerLogin = async (req: Request, res: Response) => {
    try {
      const loginRequest = new LoginRequest(req.body);
      await loginRequest.validate();

      const token = await this.managerService.login(loginRequest);

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

  driverLogin = async (req: Request, res: Response) => {
    try {
      const loginRequest = new LoginRequest(req.body);

      await loginRequest.validate();

      const token = await this.driverService.login(loginRequest);

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