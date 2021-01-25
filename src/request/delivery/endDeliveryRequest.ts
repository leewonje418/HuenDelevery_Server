import { validate } from 'class-validator';
import HttpError from '../../error/httpError';

export default class EndDeliveryRequest {
  image!: string;

  constructor(body: EndDeliveryRequest) {
    this.image = body.image;
  }

  async validate(): Promise<void> {
    const errors = await validate(this);

    if (errors.length > 0) {
      throw new HttpError(400, '검증 오류');
    }
  }
}