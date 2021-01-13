import userRepository from '../../repository/userRepository'

export default async (id: string, password: string): Promise<string> => {
    let user;
    try {
        user = await userRepository.checkManager(id, password);
        if(user == undefined) {
            throw new Error('아이디 비밀번호 맞지 않음!');
        }
    } catch (error) {
        if(error == 'Error: 아이디 비밀번호 맞지 않음!') {
            throw new Error('아이디 비밀번호 맞지 않음!');
        } else {
            console.error(error);
            throw new Error('서버 오류!');
        }
    }
    return '200';
}