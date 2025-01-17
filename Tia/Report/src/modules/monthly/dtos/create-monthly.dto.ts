import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min, Max } from 'class-validator';

export class CreateMonthlyDto {
  @ApiProperty({
    example: 'January Report',
    description: 'Name of the monthly report',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'userId123',
    description: 'Account ID associated with this report',
  })
  @IsString()
  account_id: string;

  @ApiProperty({ example: 1, description: 'Month of the report (1 = January)' })
  @IsNumber()
  @Min(1)
  @Max(12)
  month: number;

  @ApiProperty({ example: 2025, description: 'Year of the report' })
  @IsNumber()
  year: number;
}
