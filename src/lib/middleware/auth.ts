import { Response, NextFunction } from 'express';
import { verifyToken } from '../token';
import { getRepository } from 'typeorm';
import { Member } from '../../entity/member';
import logger from '../logger';
import Role from '../../enum/Role'

const managerAuth = async (req, res: Response, next: NextFunction) => {
  try {
    const member: Member = await validateAuth(req);
    if (member.role !== Role.MANAGER) {
      return res.status(403).json({
        message: '권한 없음.',
      });
    }
    req.member = member;
    next();
  } catch (err) {
    switch (err.message) {
      case 'TOKEN_IS_ARRAY':
      case 'NO_TOKEN':
      case 'INVALID_TOKEN':
      case 'NO_USER':
        res.status(401).json({
          message: '인증 되지 않음',
        });
        return
      case 'EXPIRED_TOKEN':
        res.status(410).json({
          message: '토큰 만료',
        });
        return
      default:
        logger.error('토큰 검증 서버 오류.', err.message);
        res.status(500).json({
          message: '서버 오류.',
        })
    }
  }
}
const validateAuth = async (req) => {
  const reqToken: string | string[] = req.headers['x-access-token'];
  if (Array.isArray(reqToken)) {
    throw new Error('TOKEN_IS_ARRAY');
  }

  const token = reqToken;
  try {
    const decoded = await verifyToken(token);
    const userRepo = getRepository(Member);
    const member: Member = await userRepo.findOne({
      where: {
        id: decoded.id,
      },
    });

    if (member === undefined) {
      throw new Error('NO_USER');
    }

    return member;
  } catch (err) {
    switch (err.message) {
      case 'jwt must be provided':
        throw new Error('NO_TOKEN');
      case 'jwt malformed':
      case 'invalid token':
      case 'invalid signature':
        throw new Error('INVALID_TOKEN');
      case 'jwt expired':
        throw new Error('EXPIRED_TOKEN');
      default:
        throw err;
    }
  }
}

export default {
  managerAuth,
};