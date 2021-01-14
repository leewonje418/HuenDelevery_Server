export class HttpError extends Error {
    constructor(message: string) {
        super(message);
    }
    isServerError(message: string): boolean {
        let serverError: boolean = false;
        if(message == 'Error: 아이디 비밀번호 맞지 않음!') {
            return serverError;
        } else {
            serverError = true;
            return serverError;
        }
    }
}