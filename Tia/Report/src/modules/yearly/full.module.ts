import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FullService } from './full.service';
import { FullSchema } from '../../db/entities/full.model';
import { FullRepository } from './full.repository';
import { FullController } from './full.controller';
import { MicroserviceCommunicationService } from '../microservice-communication/microservice-communication.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Full', schema: FullSchema }])],
  controllers: [FullController],
  providers: [FullService, FullRepository, MicroserviceCommunicationService],
})
export class YearlyModule {}
