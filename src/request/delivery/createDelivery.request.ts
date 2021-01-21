import { IsNotEmpty, IsNumber, IsOptional, validate } from 'class-validator';
import HttpError from '../../error/httpError';

export default class CreateDeliveryRequest {
  @IsNumber()
  customerIdx!: number;

  @IsNumber()
  driverId!: string;

  @IsNotEmpty()
  productName!: string;

  constructor(body: CreateDeliveryRequest) {
    this.customerIdx = body.customerIdx;
    this.driverId = body.driverId;
    this.productName = body.productName;
  }

  async validate(): Promise<void> {
    const errors = await validate(this);

    if (errors.length > 0) {
      throw new HttpError(400, '검증 오류');
    }
  }
}