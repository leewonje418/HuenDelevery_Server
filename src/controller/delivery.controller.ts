import { Request, Response } from 'express';
import { ReplSet } from 'typeorm';
import HttpError from '../error/httpError';
import httpErrorHandler from '../lib/handler/httpErrorHandler';
import CreateDeliveriesRequest from '../request/delivery/createDeliveries.request';
import CreateDeliveryRequest from '../request/delivery/createDelivery.request';
import EndDeliveryRequest from '../request/delivery/endDeliveryRequest';
import OrderDeliveryRequest, { OrderDeliveryItem } from '../request/delivery/orderDelivery.request';
import DeliveryService from '../service/delivery.service';

export default class DeliveryController {
  private readonly deliveryService: DeliveryService;

  constructor() {
    this.deliveryService = new DeliveryService();
  }

  getDeliveriesByDate = async (req: Request, res: Response) => {
    try {
      const { date } = req.query;
      if (typeof date !== 'string' || isNaN(Date.parse(date))) {
        throw new HttpError(400, '검증 오류');
      }

      const deliveries =
        await this.deliveryService.getDeliveriesByDate(date);

      res.status(200).json({
        message: '특정 날의 배송 조회 성공',
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
      const { userId } = req;
      const deliveries = await this.deliveryService.getDriverUncompletedDelivery(userId);

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

  getTodayDeliveryByDriver = async (req: Request, res: Response) => {
    try {
      // driverId
      const { id } = req.params;

      const deliveries = await this.deliveryService.getTodayCompletedDeliveriesByDriver(id);

      res.status(200).json({
        message: '해당 기사의 오늘 완료 배송 조회 성공',
        data: {
          deliveries,
        },
      });
    } catch (err) {
      httpErrorHandler(res, err);
    }
  }

  getTodayMyCompletedDeliveries = async (req: Request, res: Response) => {
    try {
      const { userId } = req;
      const deliveries = await this.deliveryService.getTodayCompletedDeliveriesByDriver(userId);

      res.status(200).json({
        message: '본인의 오늘 완료 배송 조회 성공',
        data: {
          deliveries,
        },
      });
    } catch (err) {
      httpErrorHandler(res, err);
    }
  }

  getDriverTodayDriveDistance = async (req: Request, res: Response) => {
    try {
      // driverId
      const { id } = req.params;
      const distance: number = await this.deliveryService.getTodayDriveDistanceByDriver(id)

      res.status(200).json({
        message: '해당 기사의 오늘 주행거리 조회 성공',
        data: {
          distance,
        },
      });
    } catch (err) {
      console.log(err);
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

  endDelivery = async (req: Request, res: Response) => {
    try {
      const { userId } = req;
      const deliveryIdx: number = Number(req.params.deliveryIdx);
      const { body } = req;
      const data = new EndDeliveryRequest(body);

      await data.validate();

      await this.deliveryService.endDelivery(userId, deliveryIdx, data);

      res.status(200).json({
        message: '상품배송이 완료되었습니다.',
      });
    } catch (err) {
      httpErrorHandler(res, err);
    }
  }

  orderDelivery = async (req: Request, res: Response) => {
    try {
      const { userId } = req;
      const { body } = req;
      const data = new OrderDeliveryRequest(body);

      await data.validate();

      const orderDeliveryPromise: Promise<void>[] = [];
      for (const bodyItem of data.orders) {
        orderDeliveryPromise.push(new OrderDeliveryItem(bodyItem).validate());
      }
      await Promise.all(orderDeliveryPromise);

      await this.deliveryService.orderDeliveryRequest(userId, data);

      res.status(200).json({
        message: '배송 정렬 성공',
      });
    } catch (err) {
      httpErrorHandler(res, err);
    }
  }
}