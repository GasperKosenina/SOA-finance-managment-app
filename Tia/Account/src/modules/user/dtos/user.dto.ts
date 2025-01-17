import { ApiProperty } from '@nestjs/swagger'
import { BankDto } from '../../bank/dtos/bank.dto'
import { Bank } from '../../../db/entities/bank.model'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class UserDto {
  @ApiProperty({ example: 'John', description: 'The first name of the user' })
  @IsString()
  name: string

  @ApiProperty({ example: 'Doe', description: 'The last name of the user' })
  @IsString()
  surname: string

  @ApiProperty({ example: 'john.doe@example.com', description: 'The email address of the user' })
  @IsString()
  email: string

  @ApiProperty({ example: 'strongPassword123', description: "The user's password" })
  @IsString()
  password: string

  @ApiProperty({
    type: BankDto,
    description: "References to the user's bank details"
  })
  @IsOptional()
  bank_details: Bank

  @ApiProperty({ example: '1234', description: "The user's clerk Id" })
  @IsString()
  account_id: string

  @ApiProperty({ example: '1000', description: "The user's total amount of money" })
  @IsNumber()
  total: number
}
