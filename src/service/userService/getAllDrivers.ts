import { Member } from '../../entity/user';
import { getRepository } from 'typeorm';
import Role from '../../enum/Role'

export default async (): Promise<Member[]> => {
    const role: Role = Role.DRIVER;
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