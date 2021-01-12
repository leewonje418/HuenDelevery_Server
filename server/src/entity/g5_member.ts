import {
    Entity,
    PrimaryGeneratedColumn, 
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryColumn,
    BaseEntity,
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator"
import * as bcrypt from "bcryptjs";

@Entity("g5_member")
export class g5_member extends BaseEntity {
    @PrimaryGeneratedColumn()
    mb_no: number;

    @Column()
    @IsNotEmpty()
    @Length(2, 20)
    mb_id: string;

    @Column()
    @IsNotEmpty()
    @Length(4, 255)
    mb_password: string;

    @Column()
    @IsNotEmpty()
    mb_name: string;

    @Column()
    mb_add2: string;

    @Column()
    mb_level: boolean;

    hashPassword() {
        this.mb_password = bcrypt.hashSync(this.mb_password, 8);
    }

    checkIfUnencryptedPasswordIsVaild(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.mb_password);
    }
}