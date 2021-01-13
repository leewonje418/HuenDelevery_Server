import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { loginValidate } from '../vaildate/loginValidate'
import managerLogin from '../service/userService/managerLogin'
import driverLogin from '../service/userService/driverLogin'
import { Member } from '../entity/member';
import customerGetAll from '../service/userService/customerGetAll'
import driverGetAll from '../service/userService/driverGetAll'
import logger from '../lib/logger/console';
import { createToken } from'../lib/token';
import { manager } from'../lib/middleware/auth'

export class UserCtrl {
     async managerLogin(req: Request, res: Response): Response {
        const { id, password } = req.body;
        const LoginValidate: loginValidate = new loginValidate(id, password);
    
        const errors = await validate(LoginValidate);
        if (errors.length > 0) {
            return res.status(400).json({
                status: 400,
                message: '로그인 형식이 맞지 않습니다.'
            });
        }
        try {
            await managerLogin(id, password);
            const token = await createToken(id);
            return res.status(200).json({
                status: 200,
                message: '로그인 성공~',
                data : {
                    token
                }
            })
        } catch (error) {
            if(error == 'Error: 아이디 비밀번호 맞지 않음!') {
                return res.status(401).json({
                    status: 401,
                    message: '아이디 혹은 비밀번호를 잘못입력하셨습니다.'
                });
            } else {
                logger.error(error);
                return res.status(500).json({
                    status: 500,
                    message: '로그인 오류입니다.'
                });
            }
        }
    }
    async driverLogin(req: Request, res: Response): Response {
        const { id, password } = req.body;
        const LoginValidate: loginValidate = new loginValidate(id, password);
    
        const errors = await validate(LoginValidate);
        if (errors.length > 0) {
            return res.status(400).json({
                status: 400,
                message: '로그인 형식이 맞지 않습니다.'
            });
        }
        try {
            await driverLogin(id, password);
            const token = await createToken(id);
            return res.status(200).json({
                status: 200,
                message: '로그인 성공~',
                data: {
                    'x-access-token' : token,
                }
            });
        } catch (error) {
            if(error == 'Error: 아이디 비밀번호 맞지 않음!') {
                return res.status(401).json({
                    status: 401,
                    message: '아이디 혹은 비밀번호를 잘못입력하셨습니다.'
                });
            } else {
                logger.error(error);
                return res.status(500).json({
                    status: 500,
                    message: '로그인 오류입니다.'
                });
            }
        }
    }
    async customerGetAll(req: Request, res: Response): Response {
        try {
            const data: Member[] = await customerGetAll();
            const managerCheck = await manager(req, res);
            if(managerCheck !== 'success') {
                return managerCheck;
            }
            return res.status(200).json({
                status: 200,
                message: '고객 조회 성공~',
                data
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: '고객 조회 오류입니다.'
            });
        }
    }
    async driverGetAll(req: Request, res: Response): Response {
        try {
            const data: Member[] = await driverGetAll();
            const managerCheck = await manager(req, res);
            if(managerCheck !== 'success') {
                return managerCheck;
            }
            return res.status(200).json({
                status: 200,
                message: '드라이버 조회 성공~',
                data
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: '드라이버 조회 오류입니다.'
            });
        }
    }
}