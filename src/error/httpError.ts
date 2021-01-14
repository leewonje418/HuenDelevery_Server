export default class HTTPError extends Error {
    constructor(message?: string) {
        super(message);
    }
}