import {
    Entity,
    PrimaryGeneratedColumn, 
    Column,
    ManyToOne,
    JoinColumn,
    createQueryBuilder
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator"
import { g5_member } from "./g5_member";

@Entity("g5_write_delivery")
export class g5_write_delivery {
    @PrimaryGeneratedColumn()
    wr_id: number;

    @ManyToOne(type => g5_member, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'fk_customer_id' })
    fk_customer_id: number;

    @ManyToOne(type => g5_member, { onDelete: "SET NULL" })
    @JoinColumn({ name: 'fk_driver_id' })
    fk_driver_id: number;

    @Column({
        name: "wr_1"
    })
    @IsNotEmpty()
    name: string;

    @Column({
        name: "wr_2"
    })
    distance: "decimal";

    @Column({
        name: "wr_3"
    })
    start_distance: string;
}