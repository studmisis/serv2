import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtPayload } from 'src/auth/jwt.strategy';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getTasks(@Req() req: Request & { user: JwtPayload }) {
    return this.tasksService.getTasks(req.user);
  }

  @Get(':id')
  getTaskById(
    @Param('id') id: string,
    @Req() req: Request & { user: JwtPayload },
  ) {
    return this.tasksService.getTaskById(Number(id), req.user);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: Request & { user: JwtPayload },
  ) {
    return this.tasksService.createTask(createTaskDto, req.user);
  }

  @Patch(':id')
  updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: Request & { user: JwtPayload },
  ) {
    return this.tasksService.updateTask(Number(id), updateTaskDto, req.user);
  }

  @Delete(':id')
  deleteTask(
    @Param('id') id: string,
    @Req() req: Request & { user: JwtPayload },
  ) {
    return this.tasksService.deleteTask(Number(id), req.user);
  }
}
