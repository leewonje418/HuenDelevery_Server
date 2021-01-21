import { getCustomRepository } from 'typeorm';
import Manager from '../entity/manager';
import HttpError from '../error/httpError';
import { createToken } from '../lib/token';
import ManagerRepository from '../repository/manager.repository';
import LoginRequest from '../request/auth/login.request';

export default class ManagerService {
  login = async (loginRequest: LoginRequest): Promise<string> => {
    const managerRepository = getCustomRepository(ManagerRepository);
    const { id, password } = loginRequest;

    const manager = await managerRepository.findByIdAndPassword(id, password);
    if (manager === undefined) {
      throw new HttpError(401, '인증 실패');
    }

    const token: string = await createToken(manager.id);

    return token;
  }

  getManager = async (id: string): Promise<Manager | undefined> => {
    const managerRepository = getCustomRepository(ManagerRepository);
    const manager = await managerRepository.findOne(id);

    return manager;
  }

  getManagers = async (): Promise<Manager[]> => {
    const managerRepository = getCustomRepository(ManagerRepository);
    const managers = await managerRepository.find();

    return managers;
  }
}