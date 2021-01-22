import { getCustomRepository } from 'typeorm';
import DeliveryRepository from '../repository/delivery.repository';
import Delivery from '../entity/delivery';
import HttpError from '../error/httpError';
import CreateDeliveryRequest from '../request/delivery/createDelivery.request';
import CreateDeliveriesRequest from '../request/delivery/createDeliveries.request';
import { IOSingleton } from '../socket';
import DeliveryEnum from '../socket/delivery/deliveryEvent';
import EndDeliveryRequest from '../request/delivery/endDeliveryRequest';
import OrderDeliveryRequest from '../request/delivery/orderDelivery.request';
import CustomerService from './customer.service';
import DriverService from './driver.service';
import { getDistance } from '../thirdParty/bing';
import Driver from '../entity/driver';

export default class DeliveryService {
  private readonly driverService: DriverService;
  private readonly customerService: CustomerService;

  constructor() {
    this.driverService = new DriverService();
    this.customerService = new CustomerService();
  }

  getDelivery = async (idx: number): Promise<Delivery | undefined> => {
    const deliveryRepository = getCustomRepository(DeliveryRepository);
    const delivery = await deliveryRepository.findOne(idx);

    return delivery;
  }

  getDeliveriesByDate = async (date: string): Promise<Delivery[]> => {
    const deliveryRepository = getCustomRepository(DeliveryRepository);
    const deliveries = await deliveryRepository.findByCreatedAt(date);

    return deliveries;
  }

  getDeliveringDeliveries = async (): Promise<Delivery[]> => {
    const deliveryRepository = getCustomRepository(DeliveryRepository);
    const deliveries = await deliveryRepository.findEndTimeIsNull();

    return deliveries;
  }

  getDriverUncompletedDelivery = async (driverId: string): Promise<Delivery[]> => {
    const deliveryRepository = getCustomRepository(DeliveryRepository);
    const driver = await this.driverService.getDriver(driverId);
    if (driver === undefined) {
      throw new HttpError(404, '회원 없음');
    }

    const deliveries = await deliveryRepository.findEndTimeIsNullByDriver(driver);

    return deliveries;
  }

  getTodayCompletedDeliveriesByDriver = async (driverId: string): Promise<Delivery[]> => {
    const deliveryRepository = getCustomRepository(DeliveryRepository);
    const driver = await this.driverService.getDriver(driverId);
    if (driver === undefined) {
      throw new HttpError(404, '회원 없음');
    }

    const deliveries = await deliveryRepository.findEndTimeIsNotNullByDriverAndCreatedAt(driver, new Date());

    return deliveries;
  }

  getTodayDriveDistanceByDriver = async (id: string): Promise<number> => {
    const deliveries: Delivery[] = await this.getTodayCompletedDeliveriesByDriver(id);

    // TODO: 물류 센터 지정
    const centerAddress = '서울특별시 금천구 가산동 371-28';

    const distancePromise: Promise<number>[] = [];
    for (var i = 0; i < deliveries.length; i += 1) {
      if (i === 0) {
        distancePromise.push(getDistance(centerAddress, deliveries[i].customer.address));
      } else {
        const start = deliveries[i - 1].customer.address;
        const end = deliveries[i].customer.address;
        distancePromise.push(getDistance(start, end));
      }
    }

    try {
      const distances: number[] = await Promise.all(distancePromise);
      if (distances.length <= 0) {
        return 0;
      }

      return distances.reduce((pre, curr) => pre + curr);
    } catch (err) {
      throw new HttpError(400, '변환할 수 없는 주소');
    }
  }

  createDelivery = async (data: CreateDeliveryRequest): Promise<void> => {
    const deliveryRepository = getCustomRepository(DeliveryRepository);

    const { customerIdx, driverId } = data;
    const customer = await this.customerService.getCustomer(customerIdx);
    if (customer === undefined) {
      throw new HttpError(404, '고객 없음');
    }

    const driver = await this.driverService.getDriver(driverId);
    if (driver === undefined) {
      throw new HttpError(404, '기사 없음');
    }

    const delivery: Delivery = deliveryRepository.create(data);
    delivery.customer = customer;
    delivery.driver = driver;
    const createdDelivery = await deliveryRepository.save(delivery);

    const namespace = IOSingleton.getInstance().io.of('delivery');
    namespace.in(`user-${driver.id}`).emit(DeliveryEnum.CREATE_NEW_DELIVERY, {
      status: 200,
      data: [
        createdDelivery,
      ],
    });
  }

  createDeliveries = async (data: CreateDeliveriesRequest): Promise<void> => {
    type DriverCreatedDelivery = {
      driverId: string;
      deliveries: Delivery[];
    }

    const deliveryRepository = getCustomRepository(DeliveryRepository);

    const { deliveries } = data;

    const createdDeliveries: DriverCreatedDelivery[] = [];
    for (const delivery of deliveries) {
      const { customerIdx, driverId } = delivery;
      const customer = await this.customerService.getCustomer(customerIdx);
      if (customer === undefined) {
        throw new HttpError(404, '고객 없음');
      }

      const driver = await this.driverService.getDriver(driverId);
      if (driver === undefined) {
        throw new HttpError(404, '기사 없음');
      }


      const saveDelivery: Delivery = deliveryRepository.create(delivery);
      saveDelivery.customer = customer;
      saveDelivery.driver = driver;
      const createdDelivery = await deliveryRepository.save(saveDelivery);

      // 중복된 배송 기사에게 할당되었을 경우
      const driverDelivery = createdDeliveries.find(e => e.driverId === driver.id);
      if (driverDelivery !== undefined) {
        driverDelivery.deliveries.push(createdDelivery);
      } else {
        createdDeliveries.push({
          driverId: driver.id,
          deliveries: [
            createdDelivery,
          ],
        });
      }
    }

    const namespace = IOSingleton.getInstance().io.of('delivery');

    for (const createdDelivery of createdDeliveries) {
      namespace.in(`user-${createdDelivery.driverId}`).emit(DeliveryEnum.CREATE_NEW_DELIVERY, {
        status: 200,
        data: createdDelivery.deliveries,
      });
    }
  }

  endDelivery = async (
    driverId: string,
    deliveryIdx: number,
    data: EndDeliveryRequest): Promise<void> => {
    const deliveryRepository = getCustomRepository(DeliveryRepository);

    const delivery = await this.getDelivery(deliveryIdx);
    if (delivery === undefined) {
      throw new HttpError(404, '배송 없음');
    }

    if (delivery.driverId !== driverId) {
      throw new HttpError(403, '본인 배송 아님');
    }

    if (delivery.endTime !== null) {
      throw new HttpError(409, '이미 완료된 배송');
    }

    delivery.endTime = new Date();
    delivery.image = data.image;

    await deliveryRepository.save(delivery);
  }

  orderDeliveryRequest = async (driverId: string, data: OrderDeliveryRequest) => {
    const deliveryRepository = getCustomRepository(DeliveryRepository);

    const { orders } = data;

    const orderNumCheckDuplicate: number[] = [];
    const deliveryCheckDuplicate: number[] = [];
    for (const order of orders) {
      if (orderNumCheckDuplicate.includes(order.endOrderNumber)) {
        throw new HttpError(400, '중복된 순서가 포함되었습니다');
      }

      if (deliveryCheckDuplicate.includes(order.deliveryIdx)) {
        throw new HttpError(400, '중복된 배송이 포함되었습니다');
      }

      orderNumCheckDuplicate.push(order.endOrderNumber);
      deliveryCheckDuplicate.push(order.deliveryIdx);
    }

    const deliveries: (Delivery | undefined)[] =
      await Promise.all(orders.map((order) => {
        return deliveryRepository.findOne(order.deliveryIdx);
      }));

    const saveDeliveries = [];
    for (let i = 0; i < deliveries.length; i += 1) {
      const delivery = deliveries[i];
      if (delivery === undefined) {
        continue;
      }

      if (delivery.driverId !== driverId) {
        throw new HttpError(403, '본인의 배송이 아님');
      }

      if (delivery.endTime === null) {
        throw new HttpError(409, '완료되지 않은 배송');
      }

      delivery.endOrderNumber = orders[i].endOrderNumber;

      saveDeliveries.push(delivery);
    }

    await deliveryRepository.save(saveDeliveries);
  }
}