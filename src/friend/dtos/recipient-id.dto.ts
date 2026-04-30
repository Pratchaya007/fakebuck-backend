import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class RecipientIdDto {
  @IsUUID('4', { message: 'Recipient id must be a valid UUID' })
  @IsString({ message: 'Recipient id must be a string' })
  @IsNotEmpty({ message: 'Recipient id is required' })
  recipentId!: string;
}
