export default class SocketError {
  readonly code: number;
  readonly message: string;

  constructor(code: number, message: string) {
    this.code = code;
    this.message = message;
  }
}