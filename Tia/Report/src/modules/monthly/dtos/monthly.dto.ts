import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsDate,
  Min,
  Max,
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

class ExpenseSummaryDto {
  @ApiProperty({ example: 'Housing', description: 'Category of the expense' })
  @IsString()
  category: string;

  @ApiProperty({
    example: 1200,
    description: 'Total amount spent on this category',
  })
  @IsNumber()
  totalAmount: number;

  @ApiProperty({ example: 1, description: 'Count of expense entries' })
  @IsNumber()
  count: number;
}

export class MonthlyDto {
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

  @ApiProperty({
    type: [IncomeSummaryDto],
    description: 'Summary of incomes for the report',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IncomeSummaryDto)
  incomeSummary: IncomeSummaryDto[];

  @ApiProperty({
    type: [ExpenseSummaryDto],
    description: 'Summary of expenses for the report',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExpenseSummaryDto)
  expenseSummary: ExpenseSummaryDto[];

  @ApiProperty({
    example: 6500,
    description: 'Total income amount for the report',
  })
  @IsNumber()
  totalIncome: number;

  @ApiProperty({
    example: 1700,
    description: 'Total expense amount for the report',
  })
  @IsNumber()
  totalExpenses: number;

  @ApiProperty({
    example: '2025-01-31T00:00:00.000Z',
    description: 'Creation date of the report',
  })
  @IsDate()
  createdAt: Date;
}
