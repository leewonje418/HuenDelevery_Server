import 'dotenv/config';
import { SignOptions } from 'jsonwebtoken'
import * as jwt from 'jsonwebtoken'

const { JWT_SECRET } = process.env;

export const createToken = async (id: string): Promise<string> => {
  const payload = {
    id,
  };

  const options: SignOptions = {
    issuer: 'Leewonje',
    expiresIn: '5d',
  }

  return jwt.sign(payload, JWT_SECRET, options);
}

export const verifyToken = async (token: string): Promise<any> => { await jwt.verify(token, JWT_SECRET); };