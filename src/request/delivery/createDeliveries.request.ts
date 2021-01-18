import { IsArray, IsObject, validate, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import CreateDeliveryRequest from './createDelivery.request';
import HttpError from '../../error/httpError';

export default class CreateDeliveriesRequest {
  @IsArray()
  deliveries!: CreateDeliveryRequest[];

  constructor(body: CreateDeliveriesRequest) {
    this.deliveries = body.deliveries;
  }

  async validate(): Promise<void> {
    const errors = await validate(this);

    if (errors.length > 0) {
      throw new HttpError(400, '검증 오류');
    }
  }
}