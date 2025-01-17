import { Injectable } from '@nestjs/common'
import { BankRepository } from './bank.repository'
import { CreateUpdateBankDto } from './dtos/create-update-bank.dto'
import { Bank } from '../../db/entities/bank.model'
import { BankDto } from './dtos/bank.dto'

@Injectable()
export class BankService {
  constructor(private readonly bankRepository: BankRepository) {}

  async createBank(bankData: CreateUpdateBankDto): Promise<Bank> {
    try {
      return await this.bankRepository.create(bankData)
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async getSingleBank(bankId: string): Promise<BankDto> {
    try {
      return await this.bankRepository.findOne({ _id: bankId })
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async getAllBanks(): Promise<BankDto[]> {
    try {
      return await this.bankRepository.find({})
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async updateBank(bankId: string, bankData: CreateUpdateBankDto): Promise<Bank> {
    try {
      return await this.bankRepository.update(bankId, bankData)
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async deleteBank(bankId: string): Promise<boolean> {
    try {
      return await this.bankRepository.delete(bankId)
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
