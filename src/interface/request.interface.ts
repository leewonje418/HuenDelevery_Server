import { Request } from 'express';
import { Socket } from 'socket.io';
import User from '../entity/user';

export interface IAuthRequest extends Request {
  user: User;
}

export interface IAuthSocket extends Socket {
  user: User;
}