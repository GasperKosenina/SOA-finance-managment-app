import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

class IncomeSummaryDto {
  @ApiProperty({ example: 'Salary', description: 'Source of the income' })
  @IsString()
  source: string;

  @ApiProperty({ example: 5000, description: 'Total amount from this source' })
  @IsNumber()
  totalAmount: number;

  @ApiProperty({ example: 2, description: 'Count of income entries' })
  @IsNumber()
  count: number;
}

export class FullDto {
  @ApiProperty({
    example: 'January Report',
    description: 'Name of the full report',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'userId123',
    description: 'Account ID associated with this report',
  })
  @IsString()
  account_id: string;

  @ApiProperty({
    type: [IncomeSummaryDto],
    description: 'Summary of incomes for the report',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IncomeSummaryDto)
  incomeSummary: IncomeSummaryDto[];

  @ApiProperty({
    example: 6500,
    description: 'Total income amount for the report',
  })
  @IsNumber()
  totalIncome: number;

  @ApiProperty({
    example: '2025-01-31T00:00:00.000Z',
    description: 'Creation date of the report',
  })
  @IsDate()
  createdAt: Date;
}
