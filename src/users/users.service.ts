import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm'; 
import { InjectRepository } from '@nestjs/typeorm'; 
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}  
  
  async create(createUserDto: CreateUserDto) {
    if (await this.userRepository.findOne({ where: { email: createUserDto.email } })) {
      throw new ConflictException('Email already exists');
    }
    if (await this.userRepository.findOne({ where: { cpf: createUserDto.cpf } })) {
      throw new ConflictException('CPF already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
       ...createUserDto, 
        password: hashedPassword,
      });
    
    const savedUser = await this.userRepository.save(user);

    const { password, ...userWithoutPassword } = savedUser;

    return userWithoutPassword;

  }

  async findAll() {
    return this.userRepository.find();
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    return this.userRepository.remove(user);
  }

  async updateRefreshTokenHash(userId: string, refreshTokenHash: string) {
  await this.userRepository.update(userId, { refreshTokenHash });
  }

  async clearRefreshTokenHash(userId: string) {
  await this.userRepository.update(userId, {
    refreshTokenHash: null,
  });
}
}
