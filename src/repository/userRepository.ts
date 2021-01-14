import { getRepository, Repository } from 'typeorm';
import User from '../entity/user';

export default class UserRepository {
    private readonly repository: Repository<User>

    constructor() {
        this.repository = getRepository(User);
    }

    async findByIdAndPassword(id: string, password: string): Promise<User | undefined> {
        return this.repository.findOne({
            where: {
                id,
                password,
            },
        });
    }
}