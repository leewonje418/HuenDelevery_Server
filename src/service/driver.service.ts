import { getCustomRepository } from 'typeorm';
import Driver from '../entity/driver';
import HttpError from '../error/httpError';
import { IDriver } from '../interface/user.interface';
import { createToken } from '../lib/token';
import DeliveryRepository from '../repository/delivery.repository';
import DriverRepository from '../repository/driver.repository';
import LoginRequest from '../request/auth/login.request';

export default class DriverService {
  login = async (loginRequest: LoginRequest): Promise<string> => {
    const driverRepository = getCustomRepository(DriverRepository);
    const { id, password } = loginRequest;

    const driver = await driverRepository.findByIdAndPassword(id, password);
    if (driver === undefined) {
      throw new HttpError(401, '인증 실패');
    }

    const token: string = await createToken(driver.id);

    return token;
  }

  getDriver = async (id: string): Promise<Driver | undefined> => {
    const driverRepository = getCustomRepository(DriverRepository);
    const driver = await driverRepository.findOne(id);

    return driver;
  }

  getDrivers = async (): Promise<IDriver[]> => {
    const driverRepository = getCustomRepository(DriverRepository);
    const rawDrivers = await driverRepository.find();

    const drivers: IDriver[] = [];

    for (const rawDriver of rawDrivers) {
      const totalCount = await this.countDriverTodayDeliveries(rawDriver);
      const completedCount = await this.countDriverTodayCompletedDeliveries(rawDriver);

      const driver: IDriver = {
        ...rawDriver,
        totalCount,
        completedCount,
      }

      drivers.push(driver);
    }

    return drivers;
  }

  countDriverTodayDeliveries = async (driver: Driver): Promise<number> => {
    const deliveryRepository = getCustomRepository(DeliveryRepository);
    const count = await deliveryRepository.countByDriverAndDate(driver, new Date());

    return count;
  }

  countDriverTodayCompletedDeliveries = async (driver: Driver): Promise<number> => {
    const deliveryRepository = getCustomRepository(DeliveryRepository);
    const count = await deliveryRepository.countEndTimeIsNotNullByDriverAndDate(driver, new Date());

    return count;
  }
}