import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator'
import User from './user';

@Entity('g5_write_delivery')
export class Delivery {
    @Column({
        name: 'wr_id'
    })
    @PrimaryGeneratedColumn()
    idx!: number;

    @ManyToOne(type => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'fk_customer_id' })
    customerIdx!: number | null;

    @ManyToOne(type => User, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'fk_driver_id' })
    driverIdx!: number | null;

    @Column({
        name: 'wr_1',
    })
    @IsNotEmpty()
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
    })
    startAddress!: string | null;
}