import { IsNumber, validate } from 'class-validator';
import HttpError from '../../error/httpError';

export default class StartDeliveryRequest {
  @IsNumber()
  long!: number

  @IsNumber()
  lat!: number

  constructor(body: StartDeliveryRequest) {
    this.long = body.long;
    this.lat = body.lat;
  }

  async validate(): Promise<void> {
    const errors = await validate(this);

    if (errors.length > 0) {
      throw new HttpError(400, '검증 오류');
    }
  }
}