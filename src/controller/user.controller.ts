import User from "../entity/user";
import { IDriver } from "../interface/user.interface";
import UserService from "../service/user.service";

export default class UserController {
    private readonly userService;

    constructor() {
        this.userService = new UserService();
    }

    async getCustomers(): Promise<User[]> {
        const customers = await this.userService.getCustomers();

        return customers;
    }

    async getDrivers(): Promise<IDriver[]> {
        const drivers = await this.userService.getDrivers();

        return drivers;
    }
}