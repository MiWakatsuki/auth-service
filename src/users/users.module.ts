import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Import the User entity to make it available for dependency injection
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Export UsersService to make it available for other modules (like AuthModule)
  
})

export class UsersModule {}
