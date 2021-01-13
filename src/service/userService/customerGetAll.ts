import { Member } from '../../entity/member';
import { getRepository } from 'typeorm';
import ERole from'../../enum/eRole'

export default async (): Promise<Member[]> => {
    const role: ERole = ERole.CUSTOMER;
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