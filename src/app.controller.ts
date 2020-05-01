import { Controller, Get, Param } from '@nestjs/common';
import { CourierService } from 'src/courier/courier.service';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly courierService: CourierService
    ) {}
    
    @Get()
    getHello(): string {
        return this.appService.getHello();
    }
    
    /**
     * find by type and trackingNo
     */
    @Get('/:type/:trackingNo')
    findByTypeTrackingNo(@Param('type') type: string, @Param('trackingNo') trackingNo: string) {
        return this.courierService.get(trackingNo, type);
    }
}
