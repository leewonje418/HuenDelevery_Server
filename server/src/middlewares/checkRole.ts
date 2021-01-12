import { Request, Response, NextFunction } from "express"
import { getRepository } from "typeorm";

import { g5_member } from "../entity/g5_member";

export const checkRole = (roles: Array<string>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = res.locals.jwtPayload.userId;
        const userRepository = getRepository(g5_member);
        let user: g5_member;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (id) {
            return res.state(401).json({
                status: 401,
                message: "권한이 없습니다."
            });
        }

        if(user.mb_level != undefined) {
            return res.state(200).json({
                status: 200,
                message: "역할 불러오기 성공~",
                data: {
                    roles
                }
            });
        } else {
            return res.status(401).json({
                status: 401,
                message: "권한이 없습니다."
            });
        }
    }
}