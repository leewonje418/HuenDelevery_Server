import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('manager')
export default class Manager {
  @PrimaryColumn()
  id!: string;

  @PrimaryColumn()
  pw!: string;

  @Column()
  name!: string;

  @Column()
  phone!: string;
}