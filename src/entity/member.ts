import {
    Entity,
    PrimaryGeneratedColumn, 
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryColumn,
    BaseEntity,
} from'typeorm';
import { Length, IsNotEmpty } from 'class-validator'

@Entity('g5_member')
export class Member extends BaseEntity {
    @Column({
        name: 'mb_no'
    })
    @PrimaryGeneratedColumn()
    idx: number;

    @Column({
        name: 'mb_id',
        unique: true
    })
    @IsNotEmpty()
    @Length(2, 20)
    id: string;

    @Column({
        name: 'mb_password'
    })
    @IsNotEmpty()
    password: string;

    @Column({
        name: 'mb_name'
    })
    @IsNotEmpty()
    name: string;

    @Column({
        name: 'mb_add2'
    })
    address: string;

    @Column({
        name: 'mb_level'
    })
    @Length(1, 10)
    role: number;
}