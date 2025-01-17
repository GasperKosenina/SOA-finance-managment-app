import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { Monthly } from '../../db/entities/monthly.model';

@Injectable()
export class MonthlyRepository {
  constructor(
    @InjectModel('Monthly') private readonly monthlyModel: Model<Monthly>,
  ) {}

  async create(monthly: Partial<Monthly>): Promise<Monthly> {
    try {
      return await new this.monthlyModel(monthly).save();
    } catch (error) {
      throw new Error('Failed to create monthly report: ' + error.message);
    }
  }

  async findOne(monthlyFilterQuery: FilterQuery<Monthly>): Promise<Monthly> {
    const monthly = await this.monthlyModel.findOne(monthlyFilterQuery).exec();
    if (!monthly) {
      throw new NotFoundException('Monthly report not found.');
    }
    return monthly;
  }

  async find(account_id: string): Promise<Monthly[]> {
    return await this.monthlyModel.find({ account_id }).exec();
  }

  async update(id: string, updateData: UpdateQuery<Monthly>): Promise<Monthly> {
    const updatedReport = await this.monthlyModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    if (!updatedReport) {
      throw new NotFoundException('Monthly report not found.');
    }
    return updatedReport;
  }

  async delete(monthlyId: string): Promise<boolean> {
    const deletedMonthly = await this.monthlyModel
      .findByIdAndDelete(monthlyId)
      .exec();

    if (!deletedMonthly) {
      throw new NotFoundException('Monthly report not found.');
    }

    return true;
  }
}
