import { CourierService } from 'src/courier/courier.service';
import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    private readonly courierService;
    constructor(appService: AppService, courierService: CourierService);
    getHello(): string;
    findByTypeTrackingNo(type: string, trackingNo: string): Promise<import("./courier/courier.service").ITracking[]>;
}
