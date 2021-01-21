import { EntityRepository, Repository } from 'typeorm';
import Customer from '../entity/customer';
import Driver from '../entity/driver';

@EntityRepository(Customer)
export default class CustomerRepository extends Repository<Customer> {
}