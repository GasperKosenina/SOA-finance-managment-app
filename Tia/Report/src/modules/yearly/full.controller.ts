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
import { FullService } from './full.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateFullDto } from './dtos/create-full.dto';
import { FullDto } from './dtos/full.dto';
import { AuthGuard } from '../../utils/validation';

@Controller('/full')
@UseGuards(AuthGuard)
export class FullController {
  constructor(private readonly fullService: FullService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Full Report' })
  @ApiResponse({
    status: 201,
    description: 'Full Report created successfully.',
    type: FullDto,
  })
  async createFullReport(
    @Body() createFullDto: CreateFullDto,
  ): Promise<FullDto> {
    return await this.fullService.createFullReport(createFullDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Fill a Full Report with aggregated data' })
  @ApiResponse({
    status: 200,
    description: 'Full Report updated successfully.',
    type: FullDto,
  })
  async fillFullReport(@Param('id') id: string): Promise<FullDto> {
    return await this.fullService.fillFullReport(id);
  }

  @Get('/user/:userid')
  @ApiOperation({ summary: 'Retrieve all Full Reports by User' })
  @ApiResponse({
    status: 200,
    description: 'Full Report details.',
    type: FullDto,
  })
  async getFullReports(@Param('userid') userId: string): Promise<FullDto[]> {
    return await this.fullService.getFullReports(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single Full Report by ID' })
  @ApiResponse({
    status: 200,
    description: 'Full Report details.',
    type: FullDto,
  })
  async getFullReportById(@Param('id') id: string): Promise<FullDto> {
    return await this.fullService.getSingleFullReport(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Full Report by ID' })
  @ApiResponse({
    status: 200,
    description: 'Full Report deleted successfully.',
    type: Boolean,
  })
  async deleteFullReport(@Param('id') id: string): Promise<boolean> {
    return await this.fullService.deleteFullReport(id);
  }
}
