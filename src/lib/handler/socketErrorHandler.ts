import { Socket } from 'socket.io';
import SocketError from '../../error/socketError';
import SocketEvent from '../../socket/socketEvent';

export default (socket: Socket, err: SocketError | Error) => {
  let code = 500;
  let message = '소켓 오류 발생';

  if (err instanceof SocketError) {
    code = err.code;
    message = err.message;
  }

  socket.emit(SocketEvent.SOCKET_ERROR, {
    status: code,
    message: message,
  });
}