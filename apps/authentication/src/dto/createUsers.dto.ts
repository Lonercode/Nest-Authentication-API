import { IsString, IsStrongPassword, IsNotEmpty, IsEmail, MinLength, MaxLength, IsBoolean } from 'class-validator'

export class CreateUsersDto{
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(30)
    name: string

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsStrongPassword()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(30)
    password: string

}