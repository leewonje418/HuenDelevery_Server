import { Length } from 'class-validator';
export class LoginValidate {
    @Length(2, 20)
    private id: string;       
    private password: string;
    
    constructor(id: string, password: string) {
        this.id = id;
        this.password = password;
    }
}