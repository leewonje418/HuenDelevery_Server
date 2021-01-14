import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
} from 'typeorm';
import { Length, IsNotEmpty } from 'class-validator'
import Role from '../enum/Role';

@Entity('g5_member')
export default class User {
    @Column({
        name: 'mb_no'
    })
    @PrimaryGeneratedColumn()
    idx!: number;

    @Column({
        name: 'mb_id',
        unique: true
    })
    @IsNotEmpty()
    @Length(2, 20)
    id!: string;

    @Column({
        name: 'mb_password',
        select: false,
    })
    @IsNotEmpty()
    password!: string;

    @Column({
        name: 'mb_name'
    })
    @IsNotEmpty()
    name!: string;

    @Column({
        name: 'mb_add2'
    })
    address!: string;

    @Column({
        name: 'mb_level'
    })
    @Length(1, 10)
    role!: Role;
}