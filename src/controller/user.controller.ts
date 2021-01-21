import { Request, Response } from 'express';
import Customer from '../entity/customer';
import httpErrorHandler from '../lib/handler/httpErrorHandler';
import CustomerService from '../service/customer.service';
import DriverService from '../service/driver.service';

export default class UserController {
    private readonly driverService: DriverService;
    private readonly customerService: CustomerService;

    constructor() {
        this.driverService = new DriverService();
        this.customerService = new CustomerService();
    }

    getCustomers = async (req: Request, res: Response) => {
        try {
            const customers = await this.customerService.getCustomers();

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
            const drivers = await this.driverService.getDrivers();

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