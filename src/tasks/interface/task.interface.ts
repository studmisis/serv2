import { User } from 'src/users/interface/user.inerface';

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  userId: string;
  user: User;
}

export interface CreateTask {
  title: string;
  description: string;
  userId: number;
}

export interface UpdateTask {
  title?: string;
  description?: string;
  completed?: boolean;
}
