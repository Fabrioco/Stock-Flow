import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserOutputUserDto {
	@ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
	id!: string;

	@ApiProperty({ example: 'Maria Silva' })
	name!: string;

	@ApiProperty({ example: 'maria@example.com' })
	email!: string;
}

export class RegisterUserOutputDto {
	@ApiProperty({ type: RegisterUserOutputUserDto })
	user!: RegisterUserOutputUserDto;
}
