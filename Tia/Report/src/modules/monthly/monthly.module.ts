import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MonthlySchema } from '../../db/entities/monthly.model';
import { MonthlyRepository } from './monthly.repository';
import { MonthlyService } from './monthly.service';
import { MonthlyController } from './monthly.controller';
import { MicroserviceCommunicationService } from '../microservice-communication/microservice-communication.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Monthly', schema: MonthlySchema }]),
    HttpModule,
  ],
  controllers: [MonthlyController],
  providers: [
    MonthlyService,
    MonthlyRepository,
    MicroserviceCommunicationService,
  ],
})
export class MonthlyModule {}
