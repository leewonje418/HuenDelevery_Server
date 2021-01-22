import { EntityRepository, Repository } from 'typeorm';
import Delivery from '../entity/delivery';
import Driver from '../entity/driver';

const END_ORDER_NUM = 'wr_2';
const CREATED_AT_COL = 'wr_4';
const END_TIME_COL = 'wr_5';

@EntityRepository(Delivery)
export default class DeliveryRepository extends Repository<Delivery> {
    countByDriverAndDate = (driver: Driver, date: Date): Promise<number> => {
        return this.createQueryBuilder()
            .where(`DATE(${CREATED_AT_COL}) = DATE(:date)`, { date })
            .andWhere(`fk_driver_id = :driverId`, { driverId: driver.id })
            .getCount();
    }

    countEndTimeIsNotNullByDriverAndDate = (driver: Driver, date: Date): Promise<number> => {
        return this.createQueryBuilder()
            .where(`DATE(${CREATED_AT_COL}) = DATE(:date)`, { date })
            .andWhere(`fk_driver_id = :driverId`, { driverId: driver.id })
            .andWhere(`${END_TIME_COL} IS NOT NULL`)
            .getCount();
    }

    findByCreatedAt = async (date: string): Promise<Delivery[]> => {
        return this.createQueryBuilder('delivery')
            .leftJoinAndSelect('delivery.driver', 'driver')
            .leftJoinAndSelect('delivery.customer', 'customer')
            .where(`DATE(${CREATED_AT_COL}) = DATE(:date)`, { date })
            .orderBy(`${CREATED_AT_COL}`, 'DESC')
            .getMany();
    }

    findEndTimeIsNotNullByDriverAndCreatedAt = async (driver: Driver, date: Date) => {
        return this.createQueryBuilder('delivery')
            .leftJoinAndSelect('delivery.driver', 'driver')
            .leftJoinAndSelect('delivery.customer', 'customer')
            .where(`DATE(${CREATED_AT_COL}) = DATE(:date)`, { date })
            .andWhere(`fk_driver_id = :driverId`, { driverId: driver.id })
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

    findEndTimeIsNullByDriver = async (driver: Driver): Promise<Delivery[]> => {
        return this.createQueryBuilder('delivery')
            .leftJoinAndSelect('delivery.driver', 'driver')
            .leftJoinAndSelect('delivery.customer', 'customer')
            .where(`${END_TIME_COL} is null`)
            .andWhere('fk_driver_id = :driverId', { driverId: driver.id })
            .getMany();
    }
}