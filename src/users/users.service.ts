import { Injectable } from '@nestjs/common';
import { User } from 'generated/prisma/client';
import { UsersRepository } from './users.repository';
import { CreateUser } from './interface/user.interface';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  create(data: CreateUser): Promise<User> {
    return this.usersRepository.createUser(data);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.usersRepository.findAll();

    return users.map((user) => {
      const { password: _password, ...result } = user;
      void _password;
      return result;
    });
  }
}
