import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

const mockUsersService = {
  findByEmail: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

const mockConfigService = {
  getOrThrow: jest.fn((key: string) => {
    const values = {
      JWT_REFRESH_SECRET: 'refresh-secret',
      JWT_REFRESH_EXPIRES_IN: '7d',
    };

    return values[key];
  }),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn(),
          },
        },

      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
