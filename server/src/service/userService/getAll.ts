import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { g5_member } from "../../entity/g5_member";

export default async (req: Request, res: Response) => {
    const userRepository = getRepository(g5_member);
    let users;
    try {
        users = await userRepository.find({
            // select: ["id", "username", "role"] 
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