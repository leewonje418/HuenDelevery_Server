import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../../entity/User";

export default async (req: Request, res: Response) => {
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