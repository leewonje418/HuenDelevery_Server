import { EntityRepository, Repository } from 'typeorm';
import Manager from '../entity/manager';

@EntityRepository(Manager)
export default class ManagerRepository extends Repository<Manager> {
    findByIdAndPassword = async (id: string, password: string): Promise<Manager | undefined> => {
        return this.findOne({
            where: {
                id,
                password,
            },
        });
    }
}