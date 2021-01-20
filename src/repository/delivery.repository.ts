import { EntityRepository, Repository } from 'typeorm';
import { Delivery } from '../entity/delivery';
import User from '../entity/user';

const END_ORDER_NUM = 'wr_2';
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

    findEndTimeIsNotNullByDriverAndCreatedAt = async (driver: User, date: Date) => {
        return this.createQueryBuilder('delivery')
            .leftJoinAndSelect('delivery.driver', 'driver')
            .leftJoinAndSelect('delivery.customer', 'customer')
            .where(`DATE(${CREATED_AT_COL}) = DATE(:date)`, { date })
            .andWhere(`fk_driver_idx = :driverIdx`, { driverIdx: driver.idx })
            .andWhere(`${END_TIME_COL} IS NOT NULL`)
            .orderBy(`${END_ORDER_NUM} IS NULL`)
            .addOrderBy(`${END_ORDER_NUM}`, 'ASC')
            .addOrderBy(`${END_TIME_COL}`, 'ASC')
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