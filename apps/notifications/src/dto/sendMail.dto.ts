import { IsEmail, IsNotEmpty, IsObject, IsString } from "class-validator";

export class SendMailDto {
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    template: string

    @IsString()
    @IsNotEmpty()
    subject: string

    @IsObject()
    context: object

}