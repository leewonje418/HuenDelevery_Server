import { IAuthSocket } from '../../interface/request.interface';
import { verifyToken } from '../../lib/token';

export default class DeliveryEventListener {
  listen = async (socket: IAuthSocket) => {
    const token = socket.handshake.query['x-access-token'];

    try {
      const decoded = await verifyToken(token);
      const idx: number = decoded['idx'];

      socket.userIdx = idx;

      socket.join(`user-${idx}`);
    }
    catch (err) {
      console.log(err);
      socket.disconnect();
    }
  }
}