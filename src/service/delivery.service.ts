import { getCustomRepository } from 'typeorm';
import DeliveryRepository from '../repository/delivery.repository';
import { Delivery } from '../entity/delivery';
import HttpError from '../error/httpError';
import CreateDeliveryRequest from '../request/delivery/createDelivery.request';
import UserService from './user.service';
import Role from '../enum/Role';
import CreateDeliveriesRequest from '../request/delivery/createDeliveries.request';
import { IOSingleton } from '../socket';
import DeliveryEnum from '../socket/delivery/deliveryEvent';
import EndDeliveryRequest from '../request/delivery/endDeliveryRequest';
import OrderDeliveryRequest from '../request/delivery/orderDelivery.request';
import User from '../entity/user';
import { convertToPosition } from '../thirdParty/google';

export default class DeliveryService {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
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

  getDriverUncompletedDelivery = async (driverIdx: number): Promise<Delivery[]> => {
    const deliveryRepository = getCustomRepository(DeliveryRepository);
    const driver = await this.userService.getUser(driverIdx);
    if (driver === undefined) {
      throw new HttpError(404, '회원 없음');
    }
    const deliveries = await deliveryRepository.findEndTimeIsNullByDriver(driver);

    return deliveries;
  }

  getTodayDeliveriesByDriver = async (driverIdx: number): Promise<Delivery[]> => {
    const deliveryRepository = getCustomRepository(DeliveryRepository);
    const driver = await this.userService.getUser(driverIdx);
    if (driver === undefined) {
      throw new HttpError(404, '회원 없음');
    }

    const deliveries = await deliveryRepository.findByDriverAndCreatedAt(driver, new Date());

    return deliveries;
  }

  private arrangeDelivery = async (customerIdx: number, driverIdx?: number) => {
    const customer = await this.userService.getUser(customerIdx);
    if (customer === undefined) {
      throw new HttpError(404, '고객 없음');
    }

    let driver: User | undefined;

    if (driverIdx === undefined) {
      driver = await this.assignDriver(customer);
    } else {
      driver = await this.userService.getUser(driverIdx);
      if (driver === undefined) {
        throw new HttpError(404, '고객 없음');
      }
    }

    if (driver.role !== Role.DRIVER || customer.role !== Role.CUSTOMER) {
      throw new HttpError(400, '옳지 않은 회원 할당');
    }

    return {
      driver,
      customer,
    }
  }

  private assignDriver = async (customer: User): Promise<User> => {
    const { address } = customer;

    const drivers = await this.userService.getDrivers();

    const customerPosition = await convertToPosition(address);
    const driversPosition = await Promise.all(drivers.map((e) => convertToPosition(e.address)));

    let minIndex = 0;
    let minValue = null;
    for (let i = 0; i < driversPosition.length; i += 1) {
      const driverPosition = driversPosition[i];
      const { lat, long } = driverPosition

      const diffLat = Math.pow(Math.abs(customerPosition.lat - lat), 2);
      const diffLong = Math.pow(Math.abs(customerPosition.long - long), 2);

      if (minValue === null) {
        minValue = diffLat + diffLong;
        minIndex = i;
      } else if (minValue > diffLat + diffLong) {
        minValue = diffLat + diffLong;
        minIndex = i;
      }
    }

    return drivers[minIndex];
  }

  createDelivery = async (data: CreateDeliveryRequest): Promise<void> => {
    const deliveryRepository = getCustomRepository(DeliveryRepository);

    const { customerIdx, driverIdx } = data;
    const { customer, driver } = await this.arrangeDelivery(customerIdx, driverIdx);

    const delivery: Delivery = deliveryRepository.create(data);
    delivery.customer = customer;
    delivery.driver = driver;
    const createdDelivery = await deliveryRepository.save(delivery);

    const namespace = IOSingleton.getInstance().io.of('delivery');
    namespace.in(`user-${driver.idx}`).emit(DeliveryEnum.CREATE_NEW_DELIVERY, {
      status: 200,
      data: {
        ...createdDelivery,
      },
    });
  }

  createDeliveries = async (data: CreateDeliveriesRequest): Promise<void> => {
    const deliveryRepository = getCustomRepository(DeliveryRepository);

    const { deliveries } = data;

    for (const delivery of deliveries) {
      const { customerIdx, driverIdx } = delivery;
      const { customer, driver } = await this.arrangeDelivery(customerIdx, driverIdx);

      const saveDelivery: Delivery = deliveryRepository.create(delivery);
      saveDelivery.customer = customer;
      saveDelivery.driver = driver;
      const createdDelivery = await deliveryRepository.save(saveDelivery);

      const namespace = IOSingleton.getInstance().io.of('delivery');
      namespace.in(`user-${driver.idx}`).emit(DeliveryEnum.CREATE_NEW_DELIVERY, {
        status: 200,
        data: {
          ...createdDelivery,
        },
      });
    }
  }

  endDelivery = async (
    driverIdx: number,
    deliveryIdx: number,
    data: EndDeliveryRequest): Promise<void> => {
    const deliveryRepository = getCustomRepository(DeliveryRepository);

    const delivery = await this.getDelivery(deliveryIdx);
    if (delivery === undefined) {
      throw new HttpError(404, '배송 없음');
    }

    if (delivery.driverIdx !== driverIdx) {
      throw new HttpError(403, '본인 배송 아님');
    }

    if (delivery.endTime !== null) {
      throw new HttpError(409, '이미 완료된 배송');
    }

    delivery.endTime = new Date();
    delivery.image = data.image;

    await deliveryRepository.save(delivery);
  }

  orderDeliveryRequest = async (driverIdx: number, data: OrderDeliveryRequest) => {
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

      if (delivery.driverIdx !== driverIdx) {
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