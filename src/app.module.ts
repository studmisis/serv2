import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TasksService } from './tasks/tasks.service';
import { TasksModule } from './tasks/tasks.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [UsersModule, TasksModule, PrismaModule],
  controllers: [],
  providers: [TasksService],
})
export class AppModule {}
