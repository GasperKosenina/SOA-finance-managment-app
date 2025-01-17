import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { Full } from '../../db/entities/full.model';

@Injectable()
export class FullRepository {
  constructor(@InjectModel('Full') public fullModel: Model<Full>) {}

  async create(full: Partial<Full>): Promise<Full> {
    try {
      return await new this.fullModel(full).save();
    } catch (error) {
      throw new Error('Failed to create full report: ' + error.message);
    }
  }

  async findOne(fullFilterQuery: FilterQuery<Full>): Promise<Full> {
    const full = await this.fullModel.findOne(fullFilterQuery).exec();
    if (!full) {
      throw new NotFoundException('Full report not found.');
    }
    return full;
  }

  async find(account_id: string): Promise<Full[]> {
    return await this.fullModel.find({ account_id }).exec();
  }

  async update(id: string, updateData: UpdateQuery<Full>): Promise<Full> {
    const updatedReport = await this.fullModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    if (!updatedReport) {
      throw new NotFoundException('Full report not found.');
    }
    return updatedReport;
  }

  async delete(fullId: string): Promise<boolean> {
    const deletedFull = await this.fullModel.findByIdAndDelete(fullId).exec();

    if (!deletedFull) {
      throw new NotFoundException('Full report not found.');
    }

    return true;
  }
}
