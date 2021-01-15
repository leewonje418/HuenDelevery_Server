import { SignOptions } from 'jsonwebtoken'
import * as jwt from 'jsonwebtoken'
import { JWT } from '../../config/config';

export const createToken = async (idx: number): Promise<string> => {
  const payload = {
    idx,
  };

  const options: SignOptions = {
    issuer: 'Huensystem',
    expiresIn: JWT.EXPIRES_IN,
  }

  return jwt.sign(payload, JWT.SECRET, options);
}

export const verifyToken = async (token: string): Promise<any> => await jwt.verify(token, JWT.SECRET);