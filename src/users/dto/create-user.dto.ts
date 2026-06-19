import { IsString, IsNotEmpty, IsEmail, MinLength, Length, Matches } from 'class-validator';

export class CreateUserDto {
    @IsString( { message: 'Name must be a string' })
    @IsNotEmpty( { message: 'Name is required' })
    @MinLength(3, { message: 'Name must be at least 3 characters' })
    name!: string;
    
    @IsString( { message: 'Email must be a string' })
    @IsNotEmpty( { message: 'Email is required' })
    @IsEmail({}, { message: 'Email must be valid' })
    email!: string;
    
    @IsString( { message: 'CPF must be a string' })
    @IsNotEmpty( { message: 'CPF is required' })
    @Matches(/^\d{11}$/, { message: 'CPF must contain only 11 digits' })
    cpf!: string;   
    
    @IsString( { message: 'Password must be a string' })
    @IsNotEmpty( { message: 'Password is required' })
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    password!: string;
}

