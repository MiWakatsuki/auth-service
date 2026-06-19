import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);

        if (!user){
            throw new UnauthorizedException('Invalid email or password');
        }
         const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const { password: _password, ...userWithoutPassword } = user;

        return userWithoutPassword;
     
    }

    login(user: any) {
    const payload = { email: user.email, sub: user.id };

    return {
        access_token: this.jwtService.sign(payload),
    };
    }
}
