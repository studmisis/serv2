import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class TaskDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  title!: string;
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  description!: string;
  @IsNumber()
  @IsNotEmpty()
  userId!: number;
}

export class CreateTaskDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  title!: string;
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  description!: string;
  @IsNumber()
  @IsNotEmpty()
  userId!: number;
}

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsBoolean()
  @IsOptional()
  completed?: boolean;
  @IsNumber()
  @IsOptional()
  userId?: number;
}
