import { EntityRepository, Repository } from 'typeorm';
import { Delivery } from '../entity/delivery';

@EntityRepository(Delivery)
export default class DeliveryRepository extends Repository<Delivery> {
    // findByEndtimeAnd = async (id: string, password: string): Promise<Delivery[] | undefined> => {
    //     return this.find({
    //         where: {
    //             id,
    //             password,
    //         },
    //     });
    // }
}