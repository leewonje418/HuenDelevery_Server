import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../../entity/User";
import logger from "../../lib/logger/console";

export default async(req: Request, res: Response) => {
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
        logger.red(error);
        return res.status(500).json({
            status: 500,
            message: "서버 오류"
        })
    }
};