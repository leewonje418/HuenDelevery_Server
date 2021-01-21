import { getCustomRepository } from 'typeorm';
import Driver from '../entity/driver';
import HttpError from '../error/httpError';
import { createToken } from '../lib/token';
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
    const driver = driverRepository.findOne(id);

    return driver;
  }

  getDrivers() {
    const driverRepository = getCustomRepository(DriverRepository);
    const drivers = driverRepository.find();

    // TODO: 오늘 얼마나 했는지 표시
    return drivers;
  }
}