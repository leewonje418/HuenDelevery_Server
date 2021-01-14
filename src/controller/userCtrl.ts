import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { LoginValidate } from '../vaildate/loginValidate'
import managerLogin from '../service/userService/managerLogin'
import driverLogin from '../service/userService/driverLogin'
import { Member } from '../entity/member';
import getAllCustomers from '../service/userService/getAllCustomers'
import getAllDrivers from '../service/userService/getAllDrivers'
import logger from '../lib/logger/console';
import { createToken } from'../lib/token';
import HttpError from '../error/httpError'

export class UserCtrl {
     async managerLogin(req: Request, res: Response): Response {
        const { id, password } = req.body;
        const loginValidate: LoginValidate = new LoginValidate(id, password);
    
        const errors = await validate(loginValidate);
        if (errors.length > 0) {
            return res.status(400).json({
                message: '로그인 형식이 맞지 않습니다.'
            });
        }
        try {
            await managerLogin(id, password);
            const token = await createToken(id);
            return res.status(200).json({
                message: '로그인 성공~',
                data : {
                    token
                }
            })
        } catch (error) {
            if(error instanceof HttpError) {
                if(error.message == 'Error: 아이디 비밀번호 맞지 않음!') {
                    return res.status(401).json({
                        message: '아이디 혹은 비밀번호를 잘못입력하셨습니다.'
                    });
                } else {
                    logger.error(error.message);
                    return res.status(500).json({
                        message: '로그인 오류입니다.'
                    });
                }
            }
        }
    }
    async driverLogin(req: Request, res: Response): Response {
        const { id, password } = req.body;
        const loginValidate: LoginValidate = new LoginValidate(id, password);
    
        const errors = await validate(loginValidate);
        if (errors.length > 0) {
            return res.status(400).json({
                message: '로그인 형식이 맞지 않습니다.'
            });
        }
        try {
            await driverLogin(id, password);
            const token = await createToken(id);
            return res.status(200).json({
                message: '로그인 성공~',
                data: {
                    'x-access-token' : token,
                }
            });
        } catch (error) {
            if(error instanceof HttpError) {
                if(error.message == 'Error: 아이디 비밀번호 맞지 않음!') {
                    return res.status(401).json({
                        message: '아이디 혹은 비밀번호를 잘못입력하셨습니다.'
                    });
                } else {
                    logger.error(error.message);
                    return res.status(500).json({
                        message: '로그인 오류입니다.'
                    });
                }
            }
        }
    }
    async getAllCustomers(req: Request, res: Response): Response {
        try {
            const data: Member[] = await getAllCustomers();
            return res.status(200).json({
                message: '고객 조회 성공~',
                data
            });
        } catch (error) {
            return res.status(500).json({
                message: '고객 조회 오류입니다.'
            });
        }
    }
    async getAllDrivers(req: Request, res: Response): Response {
        try {
            const data: Member[] = await getAllDrivers();
            return res.status(200).json({
                message: '드라이버 조회 성공~',
                data
            });
        } catch (error) {
            return res.status(500).json({
                message: '드라이버 조회 오류입니다.'
            });
        }
    }
}