import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('customer')
export default class Customer {
  @PrimaryGeneratedColumn()
  idx!: number;

  @Column()
  name!: string;

  @Column()
  address!: string;

  @Column()
  phone!: string;
}