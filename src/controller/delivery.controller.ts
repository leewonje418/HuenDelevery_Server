import { Request, Response } from 'express';
import httpErrorHandler from '../lib/handler/httpErrorHandler';
import DeliveryService from '../service/delivery.service';

export default class DeliveryController {
    private readonly deliveryService: DeliveryService;

    constructor() {
        this.deliveryService = new DeliveryService();
    }
    startDelivery = async (req: Request, res: Response) => {
        try {
            const { driverIdx, deliveryIdx, data } = req.body;
            const customers = await this.deliveryService.startDelivery(driverIdx, deliveryIdx, data);

            res.status(200).json({
                message: '상품배송이 시작되었습니다.',
                data: {
                    customers,
                },
            });
        } catch (err) {
            httpErrorHandler(res, err);
        }
    }
    endDelivery = async (req: Request, res: Response) => {
        try {
            const { driverIdx, deliveryIdx } = req.body;
            const customers = await this.deliveryService.endDelivery(driverIdx, deliveryIdx);

            res.status(200).json({
                message: '상품배송이 완료되었습니다.',
                data: {
                    customers,
                },
            });
        } catch (err) {
            httpErrorHandler(res, err);
        }
    }
}