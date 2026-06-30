import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      secret: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      signOptions: {
        expiresIn: configService.getOrThrow('JWT_ACCESS_EXPIRES_IN'),
      },
    }),
  }),
  ], 
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Export UsersService to make it available for other modules (like AuthModule)
  
})

export class UsersModule {}
