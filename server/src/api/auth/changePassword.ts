import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { User } from "../../entity/User";

export default async (req: Request, res: Response) => {
    const id = res.locals.jwtPayload.userId;
    const  { oldPassword, newPassword } = req.body;
    if(!id) {
        return res.status(401).json({
            status: 401,
            message: '권한이 없습니다.',
        })
    }
    if(!(oldPassword && newPassword)) {
        return res.status(400).json({
            status: 400,
            message: '두 비밀번호가 동일합니다.'
        });
    }
    
    const userRepository = getRepository(User);
    let user: User;
    try {
        user = await userRepository.findOneOrFail(id);
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: '비밀번호 변경 오류입니다.',
        })
    } 

    if (!user.checkIfUnencryptedPasswordIsVaild(oldPassword)) {
        return res.status(401).json({
            status: 401,
            message: '접근권한 없습니다.',
        });
    }

    user.password = newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
        return res.status(400).json({
            status: 400,
            message: '비밀번호는 4자이상이여야 합니다.'
        });
    }

    user.hashPassword();
    userRepository.save(user);

    res.status(204).json({
        status: 204,
        message: '비밀번호가 성공적으로 변경되었습니다.'
    });
}