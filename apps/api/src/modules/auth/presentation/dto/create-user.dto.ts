import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'teste@teste.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'super-secret-123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;
}
