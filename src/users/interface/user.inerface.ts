import { Task } from 'src/tasks/interface/task.interface';

export interface User {
  id: string;
  role: Role;
  email: string;
  password: string;
  tasks: Task[];
}

export interface CreateUser {
  email: string;
  password: string;
}

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}
