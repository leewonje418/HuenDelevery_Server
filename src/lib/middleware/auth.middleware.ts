import { NextFunction, Request, Response } from 'express'
import Role from '../../enum/Role';
import HttpError from '../../error/httpError';
import DriverService from '../../service/driver.service';
import ManagerService from '../../service/manager.service';
import httpErrorHandler from '../handler/httpErrorHandler';
import { verifyToken } from '../token';

export const authManager = async (req: Request, res: Response, next: NextFunction) => {
  const userId: string = await validateToken(req, res) as string;
  const managerService = new ManagerService();
  const manager = await managerService.getManager(userId);

  if (manager === undefined) {
    res.status(403).json({
      message: '기사 없음',
    });
    return;
  }

  req.userId = userId;
  next();
}

export const authDriver = async (req: Request, res: Response, next: NextFunction) => {
  const userId: string = await validateToken(req, res) as string;
  const driverService = new DriverService();
  const driver = await driverService.getDriver(userId);

  if (driver === undefined) {
    res.status(403).json({
      message: '기사 없음',
    });
    return;
  }

  req.userId = userId;
  next();
}

const validateToken = async (req: Request, res: Response): Promise<string | undefined> => {
  const token = req.headers['x-access-token'];

  try {
    if (token === undefined) {
      throw new Error('jwt must be provided');
    }

    if (Array.isArray(token)) {
      throw new Error('token is array');
    }

    const decoded = await verifyToken(token);

    return decoded.id;
  } catch (err) {

    let code;
    let message;

    switch (err.message) {
      case 'jwt must be provided':
      case 'token is array':
      case 'jwt malformed':
      case 'invalid token':
      case 'invalid signature':
      case 'invalid signature':
        code = 401;
        message = '위조된 토큰';
        break;

      case 'jwt expired':
        code = 410;
        message = '만료된 토큰';
        break;

      case 'no user':
        code = 404;
        message = '회원 없음';
        break;

      default:
        code = 500;
        message = '서버 오류';
    }

    httpErrorHandler(res, new HttpError(code, message));
  }
}
