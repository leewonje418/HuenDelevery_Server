import { getCustomRepository, getRepository } from 'typeorm';
import StartDeliveryRequest from '../request/delivery/endDeliveryRequest';
import DeliveryRepository from '../repository/delivery.repository';
import { Delivery } from '../entity/delivery';
import HttpError from '../error/httpError';
import { convertToAddress } from '../thirdParty/google';
import CreateDeliveryRequest from '../request/delivery/createDelivery.request';
import UserService from './user.service';
import Role from '../enum/Role';
import CreateDeliveriesRequest from '../request/delivery/createDeliveries.request';
import io from 'socket.io';
import { IOSingleton } from '../socket';
import DeliveryEnum from '../socket/delivery/deliveryEvent';
import EndDeliveryRequest from '../request/delivery/endDeliveryRequest';

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

  private validateUserRole = async (customerIdx: number, driverIdx: number) => {
    const driver = await this.userService.getUser(driverIdx);
    const customer = await this.userService.getUser(customerIdx);

    if (driver === undefined || customer === undefined) {
      throw new HttpError(404, '회원 없음');
    }

    if (driver.role !== Role.DRIVER || customer.role !== Role.CUSTOMER) {
      throw new HttpError(400, '옳지 않은 회원 할당');
    }

    return {
      driver,
      customer,
    }
  }


  createDelivery = async (data: CreateDeliveryRequest): Promise<void> => {
    const deliveryRepository = getCustomRepository(DeliveryRepository);

    const { customerIdx, driverIdx } = data;
    const { customer, driver } = await this.validateUserRole(customerIdx, driverIdx);

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
      const { customer, driver } = await this.validateUserRole(customerIdx, driverIdx);

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
}