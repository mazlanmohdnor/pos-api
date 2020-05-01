import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CourierService } from './courier/courier.service';

@Module({
    imports: [],
    controllers: [AppController],
    providers: [AppService, CourierService]
})
export class AppModule {}
