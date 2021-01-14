import UserRepository from '../../repository/userRepository'
import { HttpError } from '../../error/httpError'

export default async (id: string, password: string) => {
    const userRepository: UserRepository = new UserRepository();
    try {
        const user = await userRepository.checkManager(id, password);
        if(user === undefined) {
            console.log(1);
            throw new Error('아이디 비밀번호 맞지 않음!');
        }
    } catch (error) {
        const httpError = new HttpError(error);
        console.log(httpError.message);
        const isServerError = httpError.isServerError(httpError.message)
        if(isServerError == false) {
            throw new Error('아이디 비밀번호 맞지 않음!');
        } else {
            console.error(error);
            throw new Error('서버 오류!');
        }
    }
}