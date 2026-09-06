import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'sophie.vis@example.nl', description: 'User email address' })
  @IsEmail({}, { message: 'Geldig e-mailadres is verplicht' })
  @IsNotEmpty({ message: 'E-mailadres is verplicht' })
  email: string;

  @ApiProperty({ example: 'Password123!', description: 'User password' })
  @IsString()
  @IsNotEmpty({ message: 'Wachtwoord is verplicht' })
  password: string;
}
