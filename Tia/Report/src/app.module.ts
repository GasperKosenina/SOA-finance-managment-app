import { Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MonthlyModule } from './modules/monthly/monthly.module';
import { YearlyModule } from './modules/yearly/full.module';
import { MicroserviceCommunicationModule } from './modules/microservice-communication/microservice-communication.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://mongo-account:27017/Report'),
    MonthlyModule,
    YearlyModule,
    MicroserviceCommunicationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure() {}
}
