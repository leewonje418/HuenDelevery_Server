import { Response } from 'express';
import { IAuthRequest } from '../interface/request.interface';
import httpErrorHandler from '../lib/handler/httpErrorHandler';
import DeliveryService from '../service/delivery.service';

export default class DeliveryController {
  private readonly deliveryService: DeliveryService;

  constructor() {
    this.deliveryService = new DeliveryService();
  }

  startDelivery = async (req: IAuthRequest, res: Response) => {
    try {
      const driverIdx: number = req.user.idx;
      const deliveryIdx: number = Number(req.params.deliveryIdx);
      const { body } = req;

      await this.deliveryService.startDelivery(driverIdx, deliveryIdx, body);

      res.status(200).json({
        message: '배송 시작 완료',
      });
    } catch (err) {
      httpErrorHandler(res, err);
    }
  }

  endDelivery = async (req: IAuthRequest, res: Response) => {
    try {
      const driverIdx: number = req.user.idx;
      const deliveryIdx: number = Number(req.params.deliveryIdx);

      await this.deliveryService.endDelivery(driverIdx, deliveryIdx);

      res.status(200).json({
        message: '상품배송이 완료되었습니다.',
      });
    } catch (err) {
      httpErrorHandler(res, err);
    }
  }
}