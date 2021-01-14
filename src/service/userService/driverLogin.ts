import UserRepository from '../../repository/user.repository'
import HttpError from '../../error/httpError'

export default async (id: string, password: string) => {
    const userRepository: UserRepository = new UserRepository();
    try {
        const user = await userRepository.checkDriver(id, password);
        if (user === undefined) {
            throw new Error('아이디 비밀번호 맞지 않음!');
        }
    } catch (error) {
        const httpError = new HttpError(error);
        if (httpError.isServerError(httpError.message) == false) {
            throw new Error('아이디 비밀번호 맞지 않음!');
        } else {
            console.error(error);
            throw new Error('서버 오류!');
        }
    }
}