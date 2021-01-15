import { Socket } from 'socket.io';
import SocketError from '../../error/socketError';
import DriverEvent from '../../socket/driver/driverEvent';

export default (driverEvent: DriverEvent, socket: Socket, err: SocketError | Error) => {
  let code = 500;
  let message = '소켓 오류 발생';

  if (err instanceof SocketError) {
    code = err.code;
    message = err.message;
  }

  socket.emit(driverEvent, {
    status: code,
    message: message,
  });
}