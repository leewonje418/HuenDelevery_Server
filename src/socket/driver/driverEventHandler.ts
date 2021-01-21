import { IsNumber, validate } from 'class-validator';
import { IAuthSocket } from '../../interface/request.interface';
import SocketError from '../../error/socketError';
import socketErrorHandler from '../../lib/handler/socketErrorHandler';
import DriverEvent from './driverEvent';
import DriverService from '../../service/driver.service';
import ManagerService from '../../service/manager.service';

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
  private readonly managerService: ManagerService;

  constructor() {
    this.managerService = new ManagerService();
  }

  sendDriverLocation = async (socket: IAuthSocket, body: any) => {
    try {
      const { userId } = socket;

      const data = new SendDriverLocation(body);
      await data.validate();

      const { lat, long } = data;

      const managers = await this.managerService.getManagers();
      for (const manager of managers) {
        console.log(manager.id);

        socket.in(`user-${manager.id}`).emit(DriverEvent.READ_DRIVER_LOCATION, {
          status: 200,
          data: {
            driverId: userId,
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