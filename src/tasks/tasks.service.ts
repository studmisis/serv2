import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { Task } from 'generated/prisma/client';
import { CreateTask, UpdateTask } from './interface/task.interface';

@Injectable()
export class TasksService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async getTasks(): Promise<Task[]> {
    return this.taskRepository.getTasks();
  }

  async getTaskById(id: number): Promise<Task> {
    const task = await this.taskRepository.getTaskById(id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async createTask(data: CreateTask): Promise<Task> {
    return this.taskRepository.createTask(data);
  }

  async updateTask(id: number, data: UpdateTask): Promise<Task> {
    return this.taskRepository.updateTask(id, data);
  }

  async deleteTask(id: number): Promise<Task> {
    return this.taskRepository.deleteTask(id);
  }
}
