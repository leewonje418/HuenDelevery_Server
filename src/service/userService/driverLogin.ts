import userRepository from '../../repository/userRepository'
import HttpError from '../../error/httpError'

export default async (id: string, password: string) => {
    let user;
    try {
        user = await userRepository.checkDriver(id, password);
        if(user == undefined) {
            throw new Error('아이디 비밀번호 맞지 않음!');
        }
    } catch (error) {
        if(error instanceof HttpError) {
            if(error.message == 'Error: 아이디 비밀번호 맞지 않음!') {
                throw new Error('아이디 비밀번호 맞지 않음!');
            } else {
                console.error(error);
                throw new Error('서버 오류!');
            }
        }
    }
    return;
}