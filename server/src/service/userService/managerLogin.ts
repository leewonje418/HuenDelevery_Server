import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { validate } from "class-validator";
import { g5_member } from "../../entity/g5_member";
import { getRepository } from "typeorm";
import config from "../../config/config";
import { loginValidate } from "../../vaildate/loginValidate"
import userRepository from "../../repository/userRepository"

export default async (req: Request, res: Response) => {
    const { id, password } = req.body;
    let user;
    
    const LoginValidate: loginValidate = new loginValidate(id, password);

    const errors = await validate(LoginValidate);
    if (errors.length > 0) {
        return res.status(400).json({
            status: 400,
            message: "로그인 형식이 맞지 않습니다."
        });
    }
    try {
        user = userRepository.checkManager(req.body);
        if(user == undefined) {
            return res.status(400).json({
                status: 400,
                message: "아이디 혹은 비밀번호를 잘못입력하셨습니다."
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "로그인 오류입니다."
        });
    }

    if(!user.checkIfUnencryptedPasswordIsVaild(password)) {
        return res.status(401).json({
            status: 401,
            message: "권한 없음"
        });
    }

    const token = jwt.sign(
        { userId: user.mb_id, username: user.mb_name },
        config.jwtSecret,
        { expiresIn: "60h" }
    );

    return res.status(200).json({
        status: 200,
        message: "로그인 성공~",
        data: {
            "x-access-token" : token,
        }
    });
}