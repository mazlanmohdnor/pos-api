import { PosType } from 'src/courier/pos.type';
export declare class ApiChooser {
    static chooseApi(type: PosType, trackingNum: any, posLajuRetry?: number): string;
}
