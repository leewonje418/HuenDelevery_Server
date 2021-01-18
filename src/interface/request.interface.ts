import { Request } from 'express';
import { Socket } from 'socket.io';
import User from '../entity/user';

export interface IAuthSocket extends Socket {
  userIdx: number;
}