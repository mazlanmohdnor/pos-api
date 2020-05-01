import { Injectable } from '@nestjs/common';
import { COURIER_NAME } from 'src/services/courier/courier-name.constant';
import { PosType } from 'src/services/courier/pos.type';

@Injectable()
export class TypePipe {
    
    static transform(type: PosType | string): string {
        if (type) {
            switch (type) {
                case 'poslaju':
                    return COURIER_NAME.poslaju;
                case 'skynet':
                    return COURIER_NAME.skynet;
                case 'ninjavan':
                    return COURIER_NAME.ninjavan;
                case 'lex':
                    return COURIER_NAME.lex;
                case 'jnt':
                    return COURIER_NAME.jnt;
                case 'gdex':
                    return COURIER_NAME.gdex;
                case 'citylink':
                    return COURIER_NAME.citylink;
                case 'lineclear':
                    return COURIER_NAME.lineclear;
                case 'lwe':
                    return COURIER_NAME.lwe;
                case 'airpak':
                    return COURIER_NAME.airpak;
                case 'fedex':
                    return COURIER_NAME.fedex;
                case 'dhl':
                    return COURIER_NAME.dhl;
                case 'cj':
                    return COURIER_NAME.cj;
                case 'abx':
                    return COURIER_NAME.abx;
                case 'mypoz':
                    return COURIER_NAME.mypoz;
                case 'shopee':
                    return COURIER_NAME.shopee;
                case 'taqbin':
                    return COURIER_NAME.taqbin;
                case 'ups':
                    return COURIER_NAME.ups;
                case 'zepto':
                    return COURIER_NAME.zepto;
                case 'tnt':
                    return COURIER_NAME.tnt;
                case 'pgeon':
                    return COURIER_NAME.pgeon;
                case 'aramex':
                    return COURIER_NAME.aramex;
                case 'aupost':
                    return COURIER_NAME.aupost;
                case 'japan_ems':
                    return COURIER_NAME.japan_ems;
                case 'usps':
                    return COURIER_NAME.usps;
                case 'brazilianpost':
                    return COURIER_NAME.brazilianpost;
                case 'posindonesia':
                    return COURIER_NAME.posindonesia;
                case 'jne':
                    return COURIER_NAME.jne;
                case 'tiki':
                    return COURIER_NAME.tiki;
                case 'sicepat':
                    return COURIER_NAME.sicepat;
                case 'lion':
                    return COURIER_NAME.lion;
                case 'wahana':
                    return COURIER_NAME.wahana;
                case 'dhleco':
                    return COURIER_NAME.dhleco;
                case 'nationwide':
                    return COURIER_NAME.nationwide;
                case 'singpost':
                    return COURIER_NAME.singpost;
                case 'redpack':
                    return COURIER_NAME.redpack;
                default:
                    return 'Please Select';
            }
        }
    }
    
}
