import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { User } from "../../entity/User";

export default async (req: Request, res: Response) => {
    const id = req.params.id;

    const { username, role } = req.body;

    const userRepository = getRepository(User);
    let user;
    try {
        user = await userRepository.findOneOrFail(id);
        if(!user) {
            return res.status(404).json({
                status: 404,
                message: "존재하지 않는 유저입니다."
            })
        } else {
            
        }
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "유저 수정 오류"
        })
    }
    
    user.username = username;
    user.role = role;
    const errors = await validate(user);
    if (errors.length > 0) {
        return res.status(400).json({
            status: 400,
            message: "비밀번호는 4자리 이상입니다."
        })
    }

    try {
        await userRepository.save(user);
    } catch (error) {
        return res.status(409).json({
            status: 409,
            message: "이 아이디는 이미 사용중인 아이디 입니다."
        })
    }

    return res.status(204).json({
        status: 204,
        message: "프로필 수정 성공~"
    })
}