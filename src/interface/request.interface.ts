import { Request } from 'express';
import User from '../entity/user';

export default interface IAuthRequest extends Request {
  user: User;
}