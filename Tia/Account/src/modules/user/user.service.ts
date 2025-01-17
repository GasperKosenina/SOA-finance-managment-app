import { BadRequestException, Injectable } from '@nestjs/common'
import { UserRepository } from './user.repository'
import { User } from '../../db/entities/user.model'
import { CreateUpdateUserDto } from './dtos/create-update-user.dto'
import { UserDto } from './dtos/user.dto'

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async createUser(userData: CreateUpdateUserDto): Promise<User> {
    try {
      return await this.userRepository.create(userData)
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async getSingleUser(userId: string): Promise<UserDto> {
    try {
      return await this.userRepository.findOne({ _id: userId })
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async getSingleUserByAccountId(accountId: string): Promise<UserDto> {
    try {
      return await this.userRepository.findOneByAccountId({ account_id: accountId })
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async getAllUsers(): Promise<UserDto[]> {
    try {
      return await this.userRepository.find({})
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async updateUser(userId: string, userData: CreateUpdateUserDto): Promise<User> {
    try {
      return await this.userRepository.update(userId, userData)
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async updateUserByAccountId(accountId: string, userData: CreateUpdateUserDto): Promise<User> {
    try {
      return await this.userRepository.updateByAccountId(accountId, userData)
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async deleteUser(userId: string): Promise<boolean> {
    try {
      return await this.userRepository.delete(userId)
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async deleteUserByAccountId(accountId: string): Promise<boolean> {
    try {
      return await this.userRepository.deleteByAccountId(accountId)
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async addMoneyToUser(accountId: string, amount: number): Promise<User> {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0.')
    }
    return await this.userRepository.addMoneyByAccountId(accountId, amount)
  }

  async removeMoneyFromUser(accountId: string, amount: number): Promise<User> {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0.')
    }
    return await this.userRepository.removeMoneyByAccountId(accountId, amount)
  }
}
