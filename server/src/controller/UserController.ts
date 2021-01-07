import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { User } from "../entity/User";

class UserController {
    static listAll = async (req: Request, res: Response) => {
        const userRepository = getRepository(User);
        let users;
        try {
            users = await userRepository.find({
                select: ["id", "username", "role"] 
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: "전채 불러오기 오류"
            })
        }
        return res.status(200).json({
            status: 200,
            message: "전채 불러오기 성공",
            data: {
                users
            }
        })
    };

    static getOneById = async(req: Request, res: Response) => {
        const id: number = req.params.id;
        const userRepository = getRepository(User);
        try {
            const user = await userRepository.findOneOrFail(id, {
                select: ["id", "username", "role"]
            })
            if(!user) {
                return res.status(400).json({
                    status: 400,
                    message: "해당 유저는 존재하지 않습니다.",
                })
            } else {
                return res.status(200).json({
                    status: 200,
                    message: "불러오기 성공",
                    data: {
                        user
                    }
                })
            }
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: "서버 오류"
            })
        }
    };

    static newUser = async (req: Request, res: Response) => {
        let { username, password, role } = req.body;
        let user = new User();
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
            await userRepository.save(user);
        } catch (error) {
            return res.status(409).json({
                status: 409,
                message: "이 아이디는 이미 사용중인 아이디 입니다."
            })
        }

        return res.status(201).json({
            status: 201,
            message: "회원가입 성공"
        })
    };

    static editUser = async (req: Request, res: Response) => {
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
    static deleteUser = async (req: Request, res: Response) => {
        const id = req.params.id;

        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail(id);
            if(!user) {
                return res.status(404).json({
                    status: 404,
                    message: "존재하지 않는 유저입니다."
                })
            }
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: "유저 삭제 오류"
            })
        }
        return res.status(204).json({
            status: 204,
            message: "유저 삭제 성공"
        })
    }
}

export default UserController;