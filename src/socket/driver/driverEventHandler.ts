import { IsDecimal, IsNumber, validate } from 'class-validator';
import { IAuthSocket } from '../../interface/request.interface';
import SocketError from '../../error/socketError';
import socketErrorHandler from '../../lib/handler/socketErrorHandler';
import UserService from '../../service/user.service';
import DriverEvent from './driverEvent';

class SendDriverLocation {
  @IsNumber()
  lat!: number;

  @IsNumber()
  long!: number;

  constructor(data: any) {
    this.lat = data.lat;
    this.long = data.long;
  }

  async validate(): Promise<void> {
    const errors = await validate(this);
    console.log(errors);


    if (errors.length > 0) {
      throw new SocketError(400, '검증 오류');
    }
  }
}

export default class DriverEventHandler {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  sendDriverLocation = async (socket: IAuthSocket, body: any) => {
    try {
      const { userIdx } = socket;

      const data = new SendDriverLocation(body);
      await data.validate();

      const { lat, long } = data;

      const managers = await this.userService.getManagers();
      for (const manager of managers) {
        console.log(manager.idx);

        socket.in(`user-${manager.idx}`).emit(DriverEvent.READ_DRIVER_LOCATION, {
          status: 200,
          data: {
            driverIdx: userIdx,
            lat,
            long,
          },
        });
      }
    } catch (err) {
      socketErrorHandler(DriverEvent.SEND_DRIVER_LOCATION, socket, err);
    }
  }
}