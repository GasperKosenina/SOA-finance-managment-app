import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { BankSchema } from '../../db/entities/bank.model'
import { BankController } from './bank.controller'
import { BankService } from './bank.service'
import { BankRepository } from './bank.repository'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Bank', schema: BankSchema }])],
  controllers: [BankController],
  providers: [BankService, BankRepository]
})
export class BankModule {}
