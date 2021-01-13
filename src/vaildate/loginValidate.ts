import { Length } from "class-validator";
export class loginValidate {
    @Length(2, 20)
    private id: string; 
    @Length(4, 255)       
    private password: string;
    
    constructor(id: string, password: string) {
        this.id = id;
        this.password = password;
    }
}