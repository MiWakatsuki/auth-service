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

    return this.sanitizeUser(savedUser);

  }

  async findAll() {
    const users = await this.userRepository.find();

    return users.map((user) => this.sanitizeUser(user));
  }

  async findOne(id: string) {
    const user = await this.findUserById(id);
    return this.sanitizeUser(user);
  }

  private async findUserById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findInternalById(id: string) {
    return this.findUserById(id);
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findUserById(id);
    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);

    return this.sanitizeUser(updatedUser);
  }

  async remove(id: string) {
    const user = await this.findUserById(id);
    await this.userRepository.remove(user);

    return this.sanitizeUser(user);
  }

  async updateRefreshTokenHash(userId: string, refreshTokenHash: string) {
    await this.userRepository.update(userId, { refreshTokenHash });
  }

  async clearRefreshTokenHash(userId: string) {
    await this.userRepository.update(userId, {
      refreshTokenHash: null,
      });
  }

  private sanitizeUser(user: User) {
    const { password: _password, refreshTokenHash: _refreshTokenHash, ...safeUser } = user;

    return safeUser;
  }
}

