import {
    Entity,
    PrimaryGeneratedColumn, 
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryColumn,
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator"
import * as bcrypt from "bcryptjs";

@Entity()
export class User {

    @PrimaryColumn()
    @Length(2, 20)
    id: string;

    @Column()
    @IsNotEmpty()
    @Length(2, 20)
    username: string;

    @Column()
    @IsNotEmpty()
    @Length(4, 255)
    password: string;

    @Column()
    @IsNotEmpty()
    role: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
    }

    checkIfUnencryptedPasswordIsVaild(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }
}