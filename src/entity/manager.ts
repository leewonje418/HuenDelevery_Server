import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('manager')
export default class Manager {
  @PrimaryColumn()
  id!: string;

  @Column()
  password!: string;

  @Column()
  name!: string;

  @Column()
  phone!: string;
}