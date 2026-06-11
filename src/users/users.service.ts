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

  deleteUser(id: number): Promise<User> {
    return this.usersRepository.deleteUser(id);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }
}
