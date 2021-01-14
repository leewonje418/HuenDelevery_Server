import { Member } from '../../entity/member';
import { getRepository } from 'typeorm';
import Role from'../../enum/Role'

export default async (): Promise<Member[]> => {
    const role: Role = Role.CUSTOMER;
    try {
        const returnMember: Member[] = await getRepository(Member).find({
            where: {
                role
            }
        });
        return returnMember;
    } catch (error) {
        console.error(error);
        throw new Error('서버 오류!');
    }
}