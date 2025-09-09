import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CalculateSajuDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsNotEmpty()
  @IsString()
  birthDate: string;

  @IsNotEmpty()
  @IsString()
  birthTime: string;

  @IsNotEmpty()
  @IsString()
  calendarType: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsOptional()
  @IsBoolean()
  isTimeUnknown?: boolean;
}
