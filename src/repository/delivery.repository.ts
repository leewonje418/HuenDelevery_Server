import { EntityRepository, Repository } from 'typeorm';
import { Delivery } from '../entity/delivery';
import User from '../entity/user';

const CREATED_AT_COL = 'wr_4';
const END_TIME_COL = 'wr_5';

@EntityRepository(Delivery)
export default class DeliveryRepository extends Repository<Delivery> {
    findByCreatedAt = async (date: string): Promise<Delivery[]> => {
        return this.createQueryBuilder('delivery')
            .leftJoinAndSelect('delivery.driver', 'driver')
            .leftJoinAndSelect('delivery.customer', 'customer')
            .where(`DATE(${CREATED_AT_COL}) = :date`, { date })
            .orderBy(`${CREATED_AT_COL}`, 'DESC')
            .getMany();
    }

    findEndTimeIsNull = async (): Promise<Delivery[]> => {
        return this.createQueryBuilder('delivery')
            .leftJoinAndSelect('delivery.driver', 'driver')
            .leftJoinAndSelect('delivery.customer', 'customer')
            .where(`${END_TIME_COL} is null`)
            .getMany();
    }

    findEndTimeIsNullByDriver = async (driver: User): Promise<Delivery[]> => {
        return this.createQueryBuilder('delivery')
            .leftJoinAndSelect('delivery.driver', 'driver')
            .leftJoinAndSelect('delivery.customer', 'customer')
            .where(`${END_TIME_COL} is null`)
            .andWhere('fk_driver_idx = :driverIdx', { driverIdx: driver.idx })
            .getMany();
    }
}