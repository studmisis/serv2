import { IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  email!: string;
  @IsString()
  @IsNotEmpty()
  password!: string;
}
