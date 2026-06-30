import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService, 
        private readonly jwtService: JwtService, 
        private readonly configService: ConfigService) 
        {}

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

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, role: user.role };

        const accessToken = this.jwtService.sign(payload);

        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.getOrThrow('JWT_REFRESH_EXPIRES_IN'),
        });

        const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

        await this.usersService.updateRefreshTokenHash(user.id, refreshTokenHash);

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }

    async refreshToken(refreshToken: string) {
        try {
            const decoded = this.jwtService.verify(refreshToken, {
                secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
            });

            const user = await this.usersService.findInternalById(decoded.sub);

            if (!user.refreshTokenHash) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            const isRefreshTokenValid = await bcrypt.compare(
                refreshToken,
                user.refreshTokenHash,
            );

            if (!isRefreshTokenValid) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            const payload = {
                email: decoded.email,
                sub: decoded.sub,
                role: decoded.role,
            };

            return {
                access_token: this.jwtService.sign(payload),
            };
        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async logout(userId: string) {
    await this.usersService.clearRefreshTokenHash(userId);

    return {
        message: 'Logged out successfully',
    };
    }
}
