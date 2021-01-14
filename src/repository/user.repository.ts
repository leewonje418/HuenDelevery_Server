import { getRepository, Repository } from 'typeorm';
import User from '../entity/user';
import Role from '../enum/Role';

export default class UserRepository extends Repository<User> {
    async findByIdAndPassword(id: string, password: string): Promise<User | undefined> {
        const repository = getRepository(User);

        return repository.findOne({
            where: {
                id,
                password,
            },
        });
    }

    async findByRole(role: Role): Promise<User[]> {
        const repository = getRepository(User);

        return repository.find({
            where: {
                role,
            },
            order: {
                idx: 'ASC',
            },
        });
    }
}