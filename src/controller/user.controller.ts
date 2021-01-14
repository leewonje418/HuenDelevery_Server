import { Request, Response } from "express";
import { IDriver } from "../interface/user.interface";
import httpErrorHandler from "../lib/handler/httpErrorHandler";
import UserService from "../service/user.service";

export default class UserController {
    private readonly userService;

    constructor() {
        this.userService = new UserService();
    }

    async getCustomers(req: Request, res: Response) {
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

    async getDrivers(req: Request, res: Response) {
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