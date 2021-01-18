import { Namespace, Server } from 'socket.io';
import DeliveryEventListener from './delivery/deliveryEventListener';
import DriverEventListener from './driver/driverEventListener';

export class IOSingleton {
  private static ioSingleton: IOSingleton;

  io!: Server;

  private constructor() { }

  static getInstance() {
    if (IOSingleton.ioSingleton === undefined) {
      IOSingleton.ioSingleton = new IOSingleton();
    }

    return IOSingleton.ioSingleton;
  }
}

export const runSocket = (io: Server) => {
  const driverEventListener = new DriverEventListener();
  const deliveryEVentListener = new DeliveryEventListener();

  io.origins('*:*');

  const driver: Namespace = io.of('driver');
  driver.on('connect', driverEventListener.listen);

  const delivery: Namespace = io.of('delivery');
  delivery.on('connect', deliveryEVentListener.listen);

  IOSingleton.getInstance().io = io;
}