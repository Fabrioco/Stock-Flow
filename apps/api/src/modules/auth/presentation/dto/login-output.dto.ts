import { ApiProperty } from '@nestjs/swagger';

export class LoginUserOutputDto {
	@ApiProperty({ example: 'user-123' })
	id!: string;

	@ApiProperty({ example: 'Jane Doe' })
	name!: string;

	@ApiProperty({ example: 'jane.doe@example.com' })
	email!: string;
}

export class LoginOutputDto {
	@ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
	accessToken!: string;

	@ApiProperty({ type: () => LoginUserOutputDto })
	user!: LoginUserOutputDto;
}
