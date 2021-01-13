import { Request, Response, NextFunction } from 'express'
import { getRepository } from 'typeorm';

import { Member } from '../entity/member';

export const checkRole = (roles: Array<string>): Response => {
    return async (req: Request, res: Response) => {
        const id = res.locals.jwtPayload.userId;
        const userRepository = getRepository(Member);
        let user: Member;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (id) {
            return res.state(401).json({
                status: 401,
                message: '권한이 없습니다.'
            });
        }

        if(user.role !== undefined) {
            return res.state(200).json({
                status: 200,
                message: '역할 불러오기 성공~',
                data: {
                    roles
                }
            });
        } else {
            return res.status(401).json({
                status: 401,
                message: '권한이 없습니다.'
            });
        }
    }
}