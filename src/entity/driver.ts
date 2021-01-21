import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('driver')
export default class Driver {
  @PrimaryColumn()
  id!: string;

  @Column({
    select: false,
  })
  password!: string;

  @Column()
  name!: string;

  @Column()
  phone!: string;

  @Column({
    name: 'truck_number',
  })
  truckNumber!: string;

  @Column({
    name: 'truck_size'
  })
  truckSize!: number;
}