import { Namespace, Server } from 'socket.io';
import DriverEventListener from './driver/driverEventListener';

export const runSocket = (io: Server) => {
  const driverEventListener = new DriverEventListener();

  io.origins('*:*');

  const driver: Namespace = io.of('driver');

  driver.on('connect', driverEventListener.listen);
}