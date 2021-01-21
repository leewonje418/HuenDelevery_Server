import { getCustomRepository } from 'typeorm';
import Customer from '../entity/customer';
import CustomerRepository from '../repository/customer.repository';

export default class CustomerService {
  getCustomer = async (idx: number): Promise<Customer | undefined> => {
    const customerRepository = getCustomRepository(CustomerRepository);
    const customer = await customerRepository.findOne(idx);

    return customer;
  }

  getCustomers = async (): Promise<Customer[]> => {
    const customerRepository = getCustomRepository(CustomerRepository);
    const customers = await customerRepository.find();

    return customers;
  }
}