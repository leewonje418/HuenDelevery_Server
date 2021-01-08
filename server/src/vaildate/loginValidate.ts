import { IsUUID, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from "class-validator";
export class loginValidate {
    @Length(2, 20)
    public id: string;
  
    @Length(4, 255)
    public password: string;
}