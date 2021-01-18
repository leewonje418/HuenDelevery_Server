import { getCustomRepository, getRepository } from 'typeorm';
import StartDeliveryRequest from '../request/delivery/startDelivery.request';
import DeliveryRepository from '../repository/delivery.repository';
import { Delivery } from '../entity/delivery';
import HttpError from '../error/httpError';
import { convertToAddress } from '../thirdParty/google';

export default class DeliveryService {
  getDelivery = async (idx: number): Promise<Delivery | undefined> => {
    const deliveryRepository = getCustomRepository(DeliveryRepository);
    const delivery = await deliveryRepository.findOne(idx);

    return delivery;
  }

  getCompletedDeliveriesByDate = async (date: string): Promise<Delivery[]> => {
    const deliveryRepository = getCustomRepository(DeliveryRepository);
    const deliveries = await deliveryRepository.findByEndTime(date);

    return deliveries;
  }

  getDeliveringDeliveries = async (): Promise<Delivery[]> => {
    const deliveryRepository = getCustomRepository(DeliveryRepository);
    const deliveries = await deliveryRepository.findEndTimeIsNull();

    return deliveries;
  }

  startDelivery = async (driverIdx: number, deliveryIdx: number, data: StartDeliveryRequest): Promise<void> => {
    const deliveryRepository = getCustomRepository(DeliveryRepository);

    const delivery = await this.getDelivery(deliveryIdx);
    if (delivery === undefined) {
      throw new HttpError(404, '배송 없음');
    }

    if (delivery.driverIdx !== driverIdx) {
      throw new HttpError(403, '권한 없음');
    }

    const { lat, long } = data;
    const startAddress = await convertToAddress(lat, long);

    delivery.startTime = new Date();
    delivery.startAddress = startAddress;

    deliveryRepository.save(delivery);
  }

  endDelivery = async (driverIdx: number, deliveryIdx: number): Promise<void> => {
    const deliveryRepository = getCustomRepository(DeliveryRepository);

    const delivery = await this.getDelivery(deliveryIdx);
    if (delivery === undefined) {
      throw new HttpError(404, '배송 없음');
    }

    if (delivery.driverIdx !== driverIdx) {
      throw new HttpError(403, '권한 없음');
    }

    if (delivery.startAddress === null) {
      throw new HttpError(400, '아직 배송이 출발하지 않음');
    }

    delivery.endTime = new Date();

    deliveryRepository.save(delivery);
  }

}