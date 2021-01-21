import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    RelationId,
} from 'typeorm';
import Customer from './customer';
import Driver from './driver';

@Entity('g5_write_delivery')
export default class Delivery {
    @Column({
        name: 'wr_id'
    })
    @PrimaryGeneratedColumn()
    idx!: number;

    @RelationId((delivery: Delivery) => delivery.customer)
    customerIdx!: number;

    @ManyToOne(type => Customer, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'fk_customer_idx' })
    customer!: Customer;

    @RelationId((delivery: Delivery) => delivery.driver)
    driverId!: string | null;

    @ManyToOne(type => Driver, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'fk_driver_id' })
    driver!: Driver | null;

    @Column({
        name: 'wr_1',
    })
    productName!: string;

    @Column({
        name: 'wr_2',
        nullable: true,
        type: 'int',
    })
    endOrderNumber!: number | null;

    @Column({
        name: 'wr_3',
        nullable: true,
        type: 'varchar',
    })
    image!: string | null;


    @Column({
        name: 'wr_4',
        type: 'datetime'
    })
    createdAt: Date = new Date();

    @Column({
        name: 'wr_5',
        nullable: true,
        type: 'datetime'
    })
    endTime!: Date | null;
}