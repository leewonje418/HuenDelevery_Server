import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    RelationId,
} from 'typeorm';
import User from './user';

@Entity('g5_write_delivery')
export class Delivery {
    @Column({
        name: 'wr_id'
    })
    @PrimaryGeneratedColumn()
    idx!: number;

    @RelationId((delivery: Delivery) => delivery.customer)
    customerIdx!: number;

    @ManyToOne(type => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'fk_customer_idx' })
    customer!: User;

    @RelationId((delivery: Delivery) => delivery.driver)
    driverIdx!: number | null;

    @ManyToOne(type => User, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'fk_driver_idx' })
    driver!: User | null;

    @Column({
        name: 'wr_1',
    })
    productName!: string;

    @Column({
        name: 'wr_2',
        type: 'decimal',
        nullable: true,
    })
    distance!: number | null;

    @Column({
        name: 'wr_3',
        nullable: true,
        type: 'varchar',
    })
    startAddress!: string | null;

    @Column({
        name: 'wr_4',
        nullable: true,
        type: 'datetime'
    })
    startTime!: Date;

    @Column({
        name: 'wr_5',
        nullable: true,
        type: 'datetime'
    })
    endTime!: Date;
}