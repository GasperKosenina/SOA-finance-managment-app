import { Injectable, NotFoundException } from '@nestjs/common';
import { FullRepository } from './full.repository';
import { MicroserviceCommunicationService } from '../microservice-communication/microservice-communication.service';
import { CreateFullDto } from './dtos/create-full.dto';
import { FullDto } from './dtos/full.dto';
import { aggregateData } from '../../utils/aggregate-data.util';

@Injectable()
export class FullService {
  constructor(
    private readonly fullRepository: FullRepository,
    private readonly microserviceCommunicationService: MicroserviceCommunicationService,
  ) {}
  async createFullReport(fullData: CreateFullDto): Promise<FullDto> {
    return await this.fullRepository.create(fullData);
  }

  async fillFullReport(id: string): Promise<FullDto> {
    const existingReport = await this.fullRepository.findOne({ _id: id });
    if (!existingReport) {
      throw new NotFoundException('Full report not found.');
    }

    const { account_id: accountId } = existingReport;

    try {
      const incomeData =
        await this.microserviceCommunicationService.fetchFullData(accountId);

      const incomeSummary = aggregateData(incomeData, 'source');
      const totalIncome = incomeSummary.reduce(
        (sum, item) => sum + item.totalAmount,
        0,
      );

      const updatedReport = await this.fullRepository.update(id, {
        incomeSummary,
        totalIncome,
      });

      return updatedReport;
    } catch (error) {
      console.error(`Failed to fetch or update the full report: ${error}`);
      throw new Error(`Failed to fill the full report: ${error.message}`);
    }
  }

  async getSingleFullReport(id: string): Promise<FullDto> {
    return this.fullRepository.findOne({ _id: id });
  }

  async getFullReports(userId: string): Promise<FullDto[]> {
    return this.fullRepository.find(userId);
  }

  async deleteFullReport(id: string): Promise<boolean> {
    return this.fullRepository.delete(id);
  }
}
