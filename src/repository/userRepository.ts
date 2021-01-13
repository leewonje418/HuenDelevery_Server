import { Member } from '../entity/member';
import { getRepository } from 'typeorm';
import ERole from'../enum/eRole'

class UserRepository {
    async checkManager(id: string, password: string): Promise<Member> {
        const role: ERole = ERole.MANAGER;
        const returnMember: Member = await getRepository(Member).findOne({
            where: {
                id,
                password,
                role
            }
        });
        return returnMember;
    }
    async checkDriver(id: string, password: string): Promise<Member> {
        const role: ERole = ERole.DRIVER;
        const returnMember: Member = await getRepository(Member).findOne({
            where: {
                id,
                password,
                role
            }
        });
        return returnMember;
    }
}

let UserRepo = new UserRepository();
export default UserRepo;