import { Request, Response, NextFunction } from "express"
import { getRepository } from "typeorm";

import { User } from "../entity/User";

export const checkRole = (roles: Array<string>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = res.locals.jwtPayload.userId;
        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (id) {
            return res.state(401).json({
                status: 401,
                message: "권한이 없습니다."
            });
        }

        if(roles.indexOf(user.role) > -1) {
            return res.state(200).json({
                status: 200,
                message: "권한 불러오기 성공~",
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