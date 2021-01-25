import { IsNotEmpty, IsNumber, IsOptional, IsString, validate } from 'class-validator';
import HttpError from '../../error/httpError';

export default class CreateDeliveryRequest {
  @IsNumber()
  customerIdx!: number;

  @IsString()
  driverId!: string;

  @IsNotEmpty()
  productName!: string;

  @IsString()
  @IsOptional()
  createdAt?: string;

  constructor(body: CreateDeliveryRequest) {
    this.customerIdx = body.customerIdx;
    this.driverId = body.driverId;
    this.productName = body.productName;
    this.createdAt = body.createdAt;
  }

  async validate(): Promise<void> {
    const errors = await validate(this);

    if (errors.length > 0) {
      throw new HttpError(400, '검증 오류');
    }
  }
}