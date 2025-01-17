import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MonthlyDto } from './dtos/monthly.dto';
import { MonthlyService } from './monthly.service';
import { CreateMonthlyDto } from './dtos/create-monthly.dto';
import { AuthGuard } from '../../utils/validation';

@Controller('/monthly')
@UseGuards(AuthGuard)
export class MonthlyController {
  constructor(private readonly monthlyService: MonthlyService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Monthly Report' })
  @ApiResponse({
    status: 201,
    description: 'Monthly Report created successfully.',
    type: MonthlyDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid user input.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async createMonthlyReport(
    @Body() createMonthlyDto: CreateMonthlyDto,
  ): Promise<MonthlyDto> {
    return await this.monthlyService.createMonthlyReport(createMonthlyDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Fill a Monthly Report with aggregated data' })
  @ApiResponse({
    status: 200,
    description: 'Monthly Report updated successfully.',
    type: MonthlyDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Report not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async fillMonthlyReport(@Param('id') id: string): Promise<MonthlyDto> {
    return await this.monthlyService.fillMonthlyReport(id);
  }

  @Get('/user/:userid')
  @ApiOperation({ summary: 'Retrieve all Monthly Reports by User' })
  @ApiResponse({
    status: 200,
    description: 'Monthly Report details.',
    type: MonthlyDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Report not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getMonthlyReports(
    @Param('userid') userId: string,
  ): Promise<MonthlyDto[]> {
    return await this.monthlyService.getMonthlyReports(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single Monthly Report by ID' })
  @ApiResponse({
    status: 200,
    description: 'Monthly Report details.',
    type: MonthlyDto,
  })
  @ApiResponse({ status: 404, description: 'Report not found.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getMonthlyReportById(@Param('id') id: string): Promise<MonthlyDto> {
    return await this.monthlyService.getSingleMonthlyReport(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Monthly Report by ID' })
  @ApiResponse({
    status: 200,
    description: 'Monthly Report deleted successfully.',
    type: Boolean,
  })
  @ApiResponse({ status: 404, description: 'Report not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async deleteMonthlyReport(@Param('id') id: string): Promise<boolean> {
    return await this.monthlyService.deleteMonthlyReport(id);
  }
}
