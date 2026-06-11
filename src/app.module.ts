import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [UsersModule, TasksModule, PrismaModule],
  controllers: [],
})
export class AppModule {}
