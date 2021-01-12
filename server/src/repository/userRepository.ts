import { g5_member } from "../entity/g5_member";
import { getRepository } from 'typeorm';

class userRepository {
    async checkManager(request: any) {
        try {
            let LoginModel = new g5_member();
            let member: g5_member;
            
            LoginModel.mb_id = request.body.id;
            LoginModel.mb_password = request.body.pw;
            LoginModel.mb_level = true;
            LoginModel.hashPassword();

            const { mb_id, mb_password } = LoginModel;
            member = await getRepository(g5_member).findOne({
                where: {
                    mb_id,
                    mb_password
                }
            });
            
            return member
        } catch (error) {
            return error;
        }
    }
    async checkDriver(request: any) {
        try {
            let LoginModel = new g5_member();
            let member: g5_member;
            
            LoginModel.mb_id = request.body.id;
            LoginModel.mb_password = request.body.pw;
            LoginModel.mb_level = false;
            LoginModel.hashPassword();

            const { mb_id, mb_password } = LoginModel;
            member = await getRepository(g5_member).findOne({
                where: {
                    mb_id,
                    mb_password
                }
            });
            
            return member
        } catch (error) {
            return error;
        }
    }
}

let usrRepo = new userRepository();
export default usrRepo;