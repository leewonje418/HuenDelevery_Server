import Role from "../enum/Role";
import HttpError from "../error/httpError";
import { createToken } from "../lib/token";
import UserRepository from "../repository/userRepository";
import LoginRequest from "../request/auth/login.request";

export default class UserService {
  private readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async login(role: Role, loginRequest: LoginRequest): Promise<string> {
    const { id, password } = loginRequest;

    const user = await this.userRepository.findByIdAndPassword(id, password);
    if (user === undefined) {
      throw new HttpError(401, '회원 없음');
    }

    if (user.role !== role) {
      throw new HttpError(403, '권한 없음');
    }

    const token: string = await createToken(user.idx);

    return token;
  }
}