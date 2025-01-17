import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsIBAN, IsString } from 'class-validator'

export class BankDto {
  @ApiProperty({ example: 'National Bank', description: 'The name of the bank' })
  @IsString()
  bank_name: string

  @ApiProperty({ example: 'John Doe', description: 'The name of the account holder' })
  @IsString()
  account_name: string

  @ApiProperty({ example: '1234567890', description: 'The account number of the user' })
  @IsString()
  account_number: string

  @ApiProperty({
    example: 'SI56123456789012345',
    description: 'The International Bank Account Number (IBAN)',
    format: 'iban'
  })
  @IsIBAN()
  iban: string

  @ApiProperty({ example: true, description: 'The status of the bank account (active/inactive)' })
  @IsBoolean()
  status: boolean
}
