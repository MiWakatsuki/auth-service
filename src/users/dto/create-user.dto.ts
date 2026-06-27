import { IsString, IsNotEmpty, IsEmail, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ description: 'Name of the user', example: 'John Doe' })
    @IsString( { message: 'Name must be a string' })
    @IsNotEmpty( { message: 'Name is required' })
    @MinLength(3, { message: 'Name must be at least 3 characters' })
    name!: string;
    
    @ApiProperty({ description: 'Email of the user', example: 'john.doe@example.com' })
    @IsString( { message: 'Email must be a string' })
    @IsNotEmpty( { message: 'Email is required' })
    @IsEmail({}, { message: 'Email must be valid' })
    email!: string;
    
    @ApiProperty({ description: 'CPF of the user', example: '12345678901' })
    @IsString( { message: 'CPF must be a string' })
    @IsNotEmpty( { message: 'CPF is required' })
    @Matches(/^\d{11}$/, { message: 'CPF must contain only 11 digits' })
    cpf!: string;   
    
    @ApiProperty({ description: 'Password of the user', example: 'password123' })
    @IsString( { message: 'Password must be a string' })
    @IsNotEmpty( { message: 'Password is required' })
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    password!: string;
}



