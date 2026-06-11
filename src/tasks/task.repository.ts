import { Injectable } from '@nestjs/common';
import { Task } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTask, UpdateTask } from './interface/task.interface';

@Injectable()
export class TaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getTasks(): Promise<Task[]> {
    return this.prisma.task.findMany({
      include: {
        user: true,
      },
    });
  }

  async getTaskById(id: number): Promise<Task | null> {
    return this.prisma.task.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }

  async createTask(data: CreateTask): Promise<Task> {
    return this.prisma.task.create({
      data,
      include: {
        user: true,
      },
    });
  }

  async updateTask(id: number, data: UpdateTask): Promise<Task> {
    return this.prisma.task.update({
      where: { id },
      data,
      include: {
        user: true,
      },
    });
  }

  async deleteTask(id: number): Promise<Task> {
    return this.prisma.task.delete({
      where: { id },
      include: {
        user: true,
      },
    });
  }
}
