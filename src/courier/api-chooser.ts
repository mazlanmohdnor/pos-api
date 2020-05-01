import { API } from 'src/courier/api.constant';
import { PosType } from 'src/courier/pos.type';

export class ApiChooser {
    static chooseApi(type: PosType,/* api: ApiObject,*/ trackingNum, posLajuRetry?: number) {
        let url: string;
        switch (type) {
            case 'poslaju':
                // url = `${ API.poslaju }${ trackingNum }&culture=EN&dt=${ Date.now() }`;
                // url = API.poslajuV2 + trackingNum;
                if (!posLajuRetry) {
                    url = API.poslajuV3 + trackingNum;
                } else if (posLajuRetry === 2) {
                    url = `${ API.poslaju }${ trackingNum }&culture=EN&dt=${ Date.now() }`;
                } else if (posLajuRetry === 3) {
                    url = API.poslajuV2 + trackingNum;
                } else {
                    url = API.poslajuV3 + trackingNum;
                }
                break;
            case 'jnt':
                url = API.jnt;
                break;
            case 'nationwide':
                url = API.nationwide + trackingNum;
                break;
            case 'gdex':
                url = API.gdex + trackingNum;
                break;
            case 'ninjavan':
                url = API.ninjavan + trackingNum;
                break;
            case 'skynet':
                url = API.skynet + trackingNum;
                break;
            case 'airpak':
                url = API.airpak;
                break;
            case 'citylink':
                url = API.citylink + trackingNum;
                break;
            case 'singpost':
                url = API.singpost + trackingNum;
                break;
            case 'abx':
                url = API.abx + trackingNum;
                break;
            case 'lwe':
                url = API.lwe + trackingNum;
                break;
            case 'lex':
                url = API.lex + trackingNum;
                break;
            case 'dhl':
                url = API.dhl + trackingNum + '&countryCode=my&languageCode=en';
                break;
            case 'dhleco':
                url = API.dhleco + trackingNum;
                break;
            case 'lineclear':
                url = API.lineclear + trackingNum;
                break;
            case 'cj':
                url = API.cj + trackingNum;
                break;
            case 'fedex':
                url = API.fedex + trackingNum;
                break;
            case 'usps':
                url = API.usps + trackingNum;
                break;
            case 'mypoz':
                url = API.mypoz + trackingNum;
                break;
            case 'shopee':
                let time = +Date.parse(new Date().toUTCString());
                url = `${ API.shopee }${ trackingNum }&__uatu=${ time }`;
                break;
            case 'taqbin':
                url = API.taqbin + trackingNum;
                break;
            case 'ups':
                url = API.ups + trackingNum;
                break;
            case 'aramex':
                url = API.aramex + trackingNum;
                break;
            case 'zepto':
                url = API.zepto + trackingNum;
                break;
            case 'pgeon':
                url = API.pgeon + trackingNum;
                break;
            case 'aupost':
                url = API.aupost + trackingNum;
                break;
            case 'japan_ems':
                url = API.japan_ems + trackingNum;
                break;
            case 'brazilianpost':
                url = API.brazilianpost + trackingNum;
                break;
            case 'posindonesia':
                url = API.posindonesia;
                break;
            case 'tiki':
                url = API.cekongkir;
                break;
            case 'sicepat':
                url = API.cekongkir;
                break;
            case 'wahana':
                url = API.cekongkir;
                break;
            case 'lion':
                url = API.cekongkir;
                break;
            case 'jne':
                url = API.jne + trackingNum;
                break;
            case 'redpack':
                url = API.redpack + trackingNum;
                break;
            case 'tnt':
                url = `${ API.tnt }${ trackingNum }&searchType=CON&locale=en_MY&channel=OPENTRACK`;
                break;
            default:
                console.log('No type found, consider it comes from previous version which always poslaju');
                url = `${ API.poslaju }${ trackingNum }&culture=EN&dt=${ Date.now() }`;
                break;
        }
        return url;
    }
}
