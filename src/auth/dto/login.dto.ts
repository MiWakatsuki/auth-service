import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    
    @ApiProperty({ description: 'User email address', example: 'john.doe@example.com' })
    @IsString( { message: 'Email must be a string' })
    @IsNotEmpty( { message: 'Email is required' })
    @IsEmail({}, { message: 'Email must be valid' })
    email!: string;
    
    @ApiProperty({ description: 'User password', example: 'StrongPassword123' })
    @IsString( { message: 'Password must be a string' })
    @IsNotEmpty( { message: 'Password is required' })
    password!: string;
}

