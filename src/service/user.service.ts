import { getCustomRepository } from 'typeorm';
import User from '../entity/user';
import Role from '../enum/Role';
import HttpError from '../error/httpError';
import { IDriver } from '../interface/user.interface';
import { createToken } from '../lib/token';
import DeliveryRepository from '../repository/delivery.repository';
import UserRepository from '../repository/user.repository';
import LoginRequest from '../request/auth/login.request';

export default class UserService {
  login = async (role: Role, loginRequest: LoginRequest): Promise<string> => {
    const userRepository = getCustomRepository(UserRepository);
    const { id, password } = loginRequest;

    const user = await userRepository.findByIdAndPassword(id, password);
    if (user === undefined) {
      throw new HttpError(401, '인증 실패');
    }

    if (user.role !== role) {
      throw new HttpError(403, '권한 없음');
    }

    const token: string = await createToken(user.idx);

    return token;
  }

  getUser = async (idx: number): Promise<User | undefined> => {
    const userRepository = getCustomRepository(UserRepository);
    const user = await userRepository.findOne(idx);

    return user;
  }

  getCustomers = async (): Promise<User[]> => {
    const userRepository = getCustomRepository(UserRepository);
    const customers = await userRepository.findByRole(Role.CUSTOMER);

    return customers;
  }

  getDrivers = async (): Promise<IDriver[]> => {
    // 재귀적 호출로 인해 deliveryService를 사용하지 못함
    const deliveryRepository = getCustomRepository(DeliveryRepository);
    const userRepository = getCustomRepository(UserRepository);

    const userTypeDrivers = await userRepository.findByRole(Role.DRIVER);

    const drivers: IDriver[] = [];
    for (const userDriver of userTypeDrivers) {
      const driverUnCompletedDeliveries = await deliveryRepository.findEndTimeIsNullByDriver(userDriver);
      const isDelivering = driverUnCompletedDeliveries.length <= 0 ? false : true;

      const driver: IDriver = {
        ...userDriver,
        isDelivering,
      };

      drivers.push(driver);
    }

    return drivers;
  }

  getManagers = async (): Promise<User[]> => {
    const userRepository = getCustomRepository(UserRepository);
    const managers = await userRepository.findByRole(Role.MANAGER);

    return managers;
  }
}