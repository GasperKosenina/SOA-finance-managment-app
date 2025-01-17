import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model, UpdateQuery } from 'mongoose'
import { Bank } from '../../db/entities/bank.model'

@Injectable()
export class BankRepository {
  constructor(@InjectModel('Bank') public bankModel: Model<Bank>) {}

  async create(bank: Partial<Bank>): Promise<Bank> {
    try {
      return await new this.bankModel(bank).save()
    } catch (error) {
      throw new Error('Failed to create bank: ' + error.message)
    }
  }

  async findOne(bankFilterQuery: FilterQuery<Bank>): Promise<Bank> {
    try {
      return await this.bankModel.findOne(bankFilterQuery).exec()
    } catch {
      throw new NotFoundException('Could not get the bank.')
    }
  }

  async find(banksFilterQuery: FilterQuery<Bank>): Promise<Bank[]> {
    try {
      return await this.bankModel.find(banksFilterQuery)
    } catch {
      throw new NotFoundException('Could not find the banks.')
    }
  }

  async update(bankId: string, updateData: UpdateQuery<Bank>): Promise<Bank> {
    try {
      const updatedBank = await this.bankModel.findByIdAndUpdate(bankId, updateData, { new: true }).exec()
      if (!updatedBank) {
        throw new NotFoundException('Bank not found.')
      }
      return updatedBank
    } catch (error) {
      throw new Error('Failed to update bank: ' + error.message)
    }
  }

  async delete(bankId: string): Promise<boolean> {
    try {
      const deletedBank = await this.bankModel.findByIdAndDelete(bankId).exec()
      if (!deletedBank) {
        throw new NotFoundException('Bank not found.')
      }
      return true
    } catch (error) {
      throw new Error('Failed to delete bank: ' + error.message)
    }
  }
}
