import { EntityRepository, Repository } from 'typeorm';
import { Delivery } from '../entity/delivery';
import User from '../entity/user';

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

    findEndTimeIsNull = async (): Promise<Delivery[]> => {
        return this.createQueryBuilder('delivery')
            .leftJoinAndSelect('delivery.driver', 'driver')
            .leftJoinAndSelect('delivery.customer', 'customer')
            .where('wr_5 is null')
            .getMany();
    }

    findEndTimeIsNullByDriver = async (driver: User): Promise<Delivery[]> => {
        return this.find({
            where: {
                endTime: null,
                driver,
            },
        });
    }
}