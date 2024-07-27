import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ContactUsSubject } from './contact_us.schema';

export class CreateContactUsDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsEnum(ContactUsSubject)
  @IsNotEmpty()
  readonly subject: ContactUsSubject;

  @IsString()
  @IsNotEmpty()
  readonly message: string;
}
