import { EntityRepository, Repository } from 'typeorm';
import { Delivery } from '../entity/delivery';

@EntityRepository(Delivery)
export default class DeliveryRepository extends Repository<Delivery> {
}