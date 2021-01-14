import { Request, Response } from 'express';
import httpErrorHandler from '../lib/handler/httpErrorHandler';
import UserService from '../service/user.service';

export default class UserController {
    private readonly userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    getCustomers = async (req: Request, res: Response) => {
        try {
            const customers = await this.userService.getCustomers();

            res.status(200).json({
                message: '고객 전체 조회 성공',
                data: {
                    customers,
                },
            });
        } catch (err) {
            httpErrorHandler(res, err);
        }
    }

    getDrivers = async (req: Request, res: Response) => {
        try {
            const drivers = await this.userService.getDrivers();

            res.status(200).json({
                message: '기사 전체 조회 성공',
                data: {
                    drivers,
                },
            });
        } catch (err) {
            httpErrorHandler(res, err);
        }
    }
}