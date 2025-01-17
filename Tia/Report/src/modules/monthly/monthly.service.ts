import { Injectable, NotFoundException } from '@nestjs/common';
import { MonthlyRepository } from './monthly.repository';
import { MonthlyDto } from './dtos/monthly.dto';
import { CreateMonthlyDto } from './dtos/create-monthly.dto';
import { MicroserviceCommunicationService } from '../microservice-communication/microservice-communication.service';
import { aggregateData } from '../../utils/aggregate-data.util';

@Injectable()
export class MonthlyService {
  constructor(
    private readonly monthlyRepository: MonthlyRepository,
    private readonly microserviceCommunicationService: MicroserviceCommunicationService,
  ) {}

  async createMonthlyReport(
    monthlyData: CreateMonthlyDto,
  ): Promise<MonthlyDto> {
    return await this.monthlyRepository.create(monthlyData);
  }

  async fillMonthlyReport(id: string): Promise<MonthlyDto> {
    const existingReport = await this.monthlyRepository.findOne({ _id: id });
    if (!existingReport) {
      throw new NotFoundException('Monthly report not found.');
    }

    const { account_id: accountId, year, month } = existingReport;

    try {
      const incomeData =
        await this.microserviceCommunicationService.fetchMonthlyData(
          accountId,
          year,
          month,
        );

      const incomeSummary = aggregateData(incomeData, 'source');
      const totalIncome = incomeSummary.reduce(
        (sum, item) => sum + item.totalAmount,
        0,
      );

      const updatedReport = await this.monthlyRepository.update(id, {
        incomeSummary,
        totalIncome,
      });

      return updatedReport;
    } catch (error) {
      console.error(`Failed to fetch or update the monthly report: ${error}`);
      throw new Error(`Failed to fill the monthly report: ${error.message}`);
    }
  }

  async getSingleMonthlyReport(id: string): Promise<MonthlyDto> {
    return this.monthlyRepository.findOne({ _id: id });
  }

  async getMonthlyReports(userId: string): Promise<MonthlyDto[]> {
    return this.monthlyRepository.find(userId);
  }

  async deleteMonthlyReport(id: string): Promise<boolean> {
    return this.monthlyRepository.delete(id);
  }
}
