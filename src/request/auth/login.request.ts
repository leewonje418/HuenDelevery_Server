import { Length, validate } from 'class-validator';
import HttpError from '../../error/httpError';

export default class LoginRequest {
  @Length(2, 20)
  readonly id: string;
  readonly password: string;

  constructor(body: LoginRequest) {
    this.id = body.id;
    this.password = body.password;
  }

  async validate(): Promise<void> {
    const errors = await validate(this);

    if (errors.length > 0) {
      throw new HttpError(400, '검증 오류');
    }
  }
}