import { EntityRepository, Repository } from 'typeorm';
import { Delivery } from '../entity/delivery';

@EntityRepository(Delivery)
export default class DeliveryRepository extends Repository<Delivery> {
    findByEndTime = async (date: string): Promise<Delivery[]> => {
        return this.createQueryBuilder('delivery')
            .leftJoinAndSelect('delivery.driver', 'driver')
            .leftJoinAndSelect('delivery.customer', 'customer')
            .where('DATE(wr_5) = :date', { date })
            .orderBy('wr_5', 'DESC')
            .getMany();
    }
}