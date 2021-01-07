import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { User } from "../entity/User";
import config from "../config/config";

class AuthController {
    static login = async(req: Request, res: Response) => {
        let { username, password } = req.body;
        if(!(username && password)) {
            return res.status(400).json({
                status : 400,
                message: '잘못된 요청입니다.'
            });
        }

        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail({ where : { username } });
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
                message: '암호화 오류 접근 권한 없음'
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

    static changePassword = async (req: Request, res: Response) => {
        const id = res.locals.jwtPayload.userId;
        const  { oldPassword, newPassword } = req.body;
        if(!id) {
            return res.status(401).json({
                status: 401,
                message: '접근권한이 없습니다.',
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
}

export default AuthController;