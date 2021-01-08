import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { User } from "../../entity/User";
import config from "../../config/config";
import { loginValidate } from "../../vaildate/loginValidate"

export default async (req: Request, res: Response) => {
    let { id, password } = req.body;
    const LoginValidate: loginValidate = new loginValidate();

    LoginValidate.id = id;
    LoginValidate.password = password;

    const errors = await validate(LoginValidate);
    if (errors.length > 0) {
        return res.status(400).json({
            status: 400,
            message: '아이디 혹은 비밀번호가 유효하지 않습니다.'
        });
    }

    const userRepository = getRepository(User);
    let user: User;
    try {
        user = await userRepository.findOneOrFail({ where : { id } });
        if(!user) {
            return res.status(400).json({
                status: 400,
                message: '아이디 혹은 비밀번호가 유효하지 않습니다.'
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: '로그인 오류입니다.'
        });
    }

    if(!user.checkIfUnencryptedPasswordIsVaild(password)) {
        return res.status(401).json({
            status: 401,
            message: '권한 없음'
        });
    }

    const token = jwt.sign(
        { userId: user.id, username: user.username },
        config.jwtSecret,
        { expiresIn: "1h" }
    );

    return res.status(200).json({
        status: 200,
        message: '로그인 성공~',
        data: {
            'x-access-token' : token,
        }
    });
}