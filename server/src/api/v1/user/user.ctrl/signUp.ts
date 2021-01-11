import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { User } from "../../../../entity/User";
import logger from "../../../../lib/logger/console";

export default async (req: Request, res: Response) => {
    let { id, username, password, role } = req.body;
    let user = new User();
    
    user.id = id;
    user.username = username;
    user.password = password;
    user.role = role;

    const errors = await validate(user);
    if (errors.length > 0) {
        return res.status(400).json({
            status: 400,
            message: "비밀번호는 4자 이상이여야 합니다."
        })
    }

    user.hashPassword();

    const userRepository = getRepository(User);
    try {
        const finduser = await userRepository.findOne({
            where: {
                id,
            }
        })
        if(finduser) {
            return res.status(409).json({
                status: 409,
                message: "이 아이디는 이미 사용중인 아이디 입니다."
            })
        } else {
            await userRepository.save(user);
            return res.status(200).json({
                status: 200,
                message: "회원가입 성공~"
            })
        }
    } catch (error) {
        logger.red(error);
        return res.status(500).json({
            status: 500,
            message: "회원가입 과정에서 오류가 발생했습니다."
        })
    }
}