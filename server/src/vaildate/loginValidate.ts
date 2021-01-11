import { IsUUID, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from "class-validator";
export class loginValidate {
    constructor(id: string, password: string) {
        this.id = id;
        this.password = password;
    }
    @Length(2, 20)
    private id: string; 
    @Length(4, 255)       
    private password: string;
}