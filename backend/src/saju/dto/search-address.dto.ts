import { IsString } from 'class-validator';

export class SearchAddressDto {
  @IsString()
  query: string;
}
