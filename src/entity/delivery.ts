import {
    Entity,
    PrimaryGeneratedColumn, 
    Column,
    ManyToOne,
    JoinColumn,
    createQueryBuilder
} from 'typeorm';
import { Length, IsNotEmpty } from 'class-validator'
import { Member } from './member';
import { type } from 'os';

@Entity('g5_write_delivery')
export class Delivery {
    @Column({
        name: 'wr_id'
    })
    @PrimaryGeneratedColumn()
    idx: number;

    @ManyToOne(type => Member, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'fk_customer_id' })
    customer_id: number;

    @ManyToOne(type => Member, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'fk_driver_id' })
    driver_id: number;

    @Column({
        name: 'wr_1'
    })
    @IsNotEmpty()
    name: string;

    @Column({
        name: 'wr_2',
        type: 'decimal'
    })
    distance;

    @Column({
        name: 'wr_3'
    })
    start_address: string;
}