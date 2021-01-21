import { EntityRepository, Repository } from 'typeorm';
import Driver from '../entity/driver';

@EntityRepository(Driver)
export default class DriverRepository extends Repository<Driver> {
    findByIdAndPassword = async (id: string, password: string): Promise<Driver | undefined> => {
        return this.findOne({
            where: {
                id,
                password,
            },
        });
    }
}