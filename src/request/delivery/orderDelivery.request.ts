import { IsArray, validate } from 'class-validator';
import HttpError from '../../error/httpError';

export class OrderDeliveryItem {
  deliveryIdx: number;
  endOrderNumber: number;

  constructor(body: OrderDeliveryItem) {
    this.deliveryIdx = body.deliveryIdx;
    this.endOrderNumber = body.endOrderNumber;
  }

  async validate(): Promise<void> {
    const errors = await validate(this);

    if (errors.length > 0) {
      throw new HttpError(400, '검증 오류');
    }
  }
}

export default class OrderDeliveryRequest {
  @IsArray()
  orders: OrderDeliveryItem[];

  constructor(body: OrderDeliveryRequest) {
    this.orders = body.orders;
  }

  async validate(): Promise<void> {
    const errors = await validate(this);

    if (errors.length > 0) {
      throw new HttpError(400, '검증 오류');
    }
  }
}