import { EntityRepository, getCustomRepository, getRepository, Repository } from 'typeorm';
import User from '../entity/user';
import Role from '../enum/Role';

@EntityRepository(User)
export default class UserRepository extends Repository<User> {
    findByIdAndPassword = async (id: string, password: string): Promise<User | undefined> => {
        return this.findOne({
            where: {
                id,
                password,
            },
        });
    }

    findByRole = async (role: Role): Promise<User[]> => {
        return this.find({
            where: {
                role,
            },
            order: {
                idx: 'ASC',
            },
        });
    }
}