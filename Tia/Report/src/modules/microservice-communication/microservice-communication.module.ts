import { Module } from '@nestjs/common';
import { MicroserviceCommunicationService } from '../microservice-communication/microservice-communication.service';

@Module({
  imports: [],
  controllers: [],
  providers: [MicroserviceCommunicationService],
})
export class MicroserviceCommunicationModule {}
