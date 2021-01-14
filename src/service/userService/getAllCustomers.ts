import { Member } from '../../entity/member';
import { getRepository } from 'typeorm';
import Role from'../../enum/Role'

export default async (): Promise<Member[]> => {
    const role: Role = Role.CUSTOMER;
    let returnMember: Member[]
    try {
        returnMember = await getRepository(Member).find({
            where: {
                role
            }
        });
    } catch (error) {
        console.error(error);
        throw new Error('서버 오류!');
    }
    return returnMember;
}