import { Request, Response } from 'express';
import HttpError from '../error/httpError';
import httpErrorHandler from '../lib/handler/httpErrorHandler';
import CreateDeliveriesRequest from '../request/delivery/createDeliveries.request';
import CreateDeliveryRequest from '../request/delivery/createDelivery.request';
import StartDeliveryRequest from '../request/delivery/startDelivery.request';
import DeliveryService from '../service/delivery.service';

export default class DeliveryController {
  private readonly deliveryService: DeliveryService;

  constructor() {
    this.deliveryService = new DeliveryService();
  }

  getCompletedDeliveries = async (req: Request, res: Response) => {
    try {
      const { date } = req.query;
      if (typeof date !== 'string' || isNaN(Date.parse(date))) {
        throw new HttpError(400, '검증 오류');
      }

      const deliveries =
        await this.deliveryService.getCompletedDeliveriesByDate(date);

      res.status(200).json({
        message: '완료된 배송 조회 성공',
        data: {
          deliveries,
        },
      });
    } catch (err) {
      httpErrorHandler(res, err);
    }
  }

  getDeliveringDeliveries = async (req: Request, res: Response) => {
    try {
      const deliveries = await this.deliveryService.getDeliveringDeliveries();

      res.status(200).json({
        message: '배송 중 배송 조회 성공',
        data: {
          deliveries,
        },
      });
    } catch (err) {
      httpErrorHandler(res, err);
    }
  }

  getMyDeliveries = async (req: Request, res: Response) => {
    try {
      const { user } = req;
      const deliveries = await this.deliveryService.getDriverUncompletedDelivery(user.idx);

      res.status(200).json({
        message: '배송할 물품 조회 성공',
        data: {
          deliveries,
        },
      })
    } catch (err) {
      httpErrorHandler(res, err);
    }
  }

  createDelivery = async (req: Request, res: Response) => {
    try {
      const { body } = req;
      const data = new CreateDeliveryRequest(body);

      await data.validate();

      await this.deliveryService.createDelivery(data);

      res.status(200).json({
        message: '배송 생성 완료',
      });
    } catch (err) {
      httpErrorHandler(res, err);
    }
  }

  createDeliveries = async (req: Request, res: Response) => {
    try {
      const { body } = req;
      const data = new CreateDeliveriesRequest(body);

      await data.validate();

      // 검증
      const createDeliveryPromise: Promise<void>[] = [];
      for (const createDelivery of data.deliveries) {
        createDeliveryPromise.push(new CreateDeliveryRequest(createDelivery).validate());
      }
      await Promise.all(createDeliveryPromise);

      await this.deliveryService.createDeliveries(data);

      res.status(200).json({
        message: '배송 생성 완료',
      });
    } catch (err) {
      httpErrorHandler(res, err);
    }
  }

  startDelivery = async (req: Request, res: Response) => {
    try {
      const driverIdx: number = req.user.idx;
      const deliveryIdx: number = Number(req.params.deliveryIdx);
      const data = new StartDeliveryRequest(req.body);

      await data.validate();

      await this.deliveryService.startDelivery(driverIdx, deliveryIdx, data);

      res.status(200).json({
        message: '배송 시작 완료',
      });
    } catch (err) {
      httpErrorHandler(res, err);
    }
  }

  endDelivery = async (req: Request, res: Response) => {
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