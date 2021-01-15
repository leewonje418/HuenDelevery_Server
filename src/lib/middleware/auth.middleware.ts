import { NextFunction, Request, Response } from 'express'
import User from '../../entity/user';
import Role from '../../enum/Role';
import HttpError from '../../error/httpError';
import UserService from '../../service/user.service';
import { IAuthRequest } from '../../interface/request.interface';
import httpErrorHandler from '../handler/httpErrorHandler';
import { verifyToken } from '../token';

export const authManager = async (req: any, res: Response, next: NextFunction) => {
  const user = await validateToken(req, res);
  if (user === undefined) {
    return;
  }

  if (user.role !== Role.MANAGER) {
    res.status(403).json({
      message: '권한 없음',
    });

    return;
  }

  req.user = user;
  next();
}

export const authDriver = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  const user = await validateToken(req, res);
  if (user === undefined) {
    return;
  }

  if (user.role !== Role.DRIVER) {
    res.status(403).json({
      message: '권한 없음',
    });

    return;
  }

  req.user = user;
  next();
}

const validateToken = async (req: Request, res: Response): Promise<User | undefined> => {
  const token = req.headers['x-access-token'];
  const userService = new UserService();

  try {
    if (token === undefined) {
      throw new Error('jwt must be provided');
    }

    if (Array.isArray(token)) {
      throw new Error('token is array');
    }

    const decoded = await verifyToken(token);
    const user = await userService.getUser(decoded['idx']);
    if (user === undefined) {
      throw new Error('no user');
    }

    return user;
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
