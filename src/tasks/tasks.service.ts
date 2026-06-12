import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Role, Task } from 'generated/prisma/client';
import { JwtPayload } from 'src/auth/jwt.strategy';
import { TaskRepository } from './task.repository';
import { CreateTask, UpdateTask } from './interface/task.interface';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly taskRepository: TaskRepository) {}

  async getTasks(user: JwtPayload): Promise<Task[]> {
    if (user.role === Role.ADMIN) {
      return this.taskRepository.getTasks();
    }

    return this.taskRepository.getTasksByUserId(user.sub);
  }

  async getTaskById(id: number, user: JwtPayload): Promise<Task> {
    const task = await this.findTaskOrThrow(id);
    this.assertCanRead(task, user);
    return task;
  }

  async createTask(
    data: Omit<CreateTask, 'userId'>,
    user: JwtPayload,
  ): Promise<Task> {
    const task = await this.taskRepository.createTask({
      ...data,
      userId: user.sub,
    });

    this.logger.log(`Task created: id=${task.id} by userId=${user.sub}`);

    return task;
  }

  async updateTask(
    id: number,
    data: UpdateTask,
    user: JwtPayload,
  ): Promise<Task> {
    const task = await this.findTaskOrThrow(id);
    this.assertIsOwner(task, user);
    return this.taskRepository.updateTask(id, data);
  }

  async deleteTask(id: number, user: JwtPayload): Promise<Task> {
    const task = await this.findTaskOrThrow(id);
    this.assertCanDelete(task, user);

    const deleted = await this.taskRepository.deleteTask(id);

    this.logger.log(`Task deleted: id=${id} by userId=${user.sub}`);

    return deleted;
  }

  private async findTaskOrThrow(id: number): Promise<Task> {
    const task = await this.taskRepository.getTaskById(id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  private assertCanRead(task: Task, user: JwtPayload): void {
    if (user.role === Role.ADMIN || task.userId === user.sub) {
      return;
    }

    throw new ForbiddenException();
  }

  private assertIsOwner(task: Task, user: JwtPayload): void {
    if (task.userId === user.sub) {
      return;
    }

    throw new ForbiddenException();
  }

  private assertCanDelete(task: Task, user: JwtPayload): void {
    if (user.role === Role.ADMIN || task.userId === user.sub) {
      return;
    }

    throw new ForbiddenException();
  }
}
