"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_constant_1 = require("./api.constant");
const pos_type_1 = require("./pos.type");
class ApiChooser {
    static chooseApi(type, trackingNum, posLajuRetry) {
        let url;
        switch (type) {
            case 'poslaju':
                if (!posLajuRetry) {
                    url = api_constant_1.API.poslajuV3 + trackingNum;
                }
                else if (posLajuRetry === 2) {
                    url = `${api_constant_1.API.poslaju}${trackingNum}&culture=EN&dt=${Date.now()}`;
                }
                else if (posLajuRetry === 3) {
                    url = api_constant_1.API.poslajuV2 + trackingNum;
                }
                else {
                    url = api_constant_1.API.poslajuV3 + trackingNum;
                }
                break;
            case 'jnt':
                url = api_constant_1.API.jnt;
                break;
            case 'nationwide':
                url = api_constant_1.API.nationwide + trackingNum;
                break;
            case 'gdex':
                url = api_constant_1.API.gdex + trackingNum;
                break;
            case 'ninjavan':
                url = api_constant_1.API.ninjavan + trackingNum;
                break;
            case 'skynet':
                url = api_constant_1.API.skynet + trackingNum;
                break;
            case 'airpak':
                url = api_constant_1.API.airpak;
                break;
            case 'citylink':
                url = api_constant_1.API.citylink + trackingNum;
                break;
            case 'singpost':
                url = api_constant_1.API.singpost + trackingNum;
                break;
            case 'abx':
                url = api_constant_1.API.abx + trackingNum;
                break;
            case 'lwe':
                url = api_constant_1.API.lwe + trackingNum;
                break;
            case 'lex':
                url = api_constant_1.API.lex + trackingNum;
                break;
            case 'dhl':
                url = api_constant_1.API.dhl + trackingNum + '&countryCode=my&languageCode=en';
                break;
            case 'dhleco':
                url = api_constant_1.API.dhleco + trackingNum;
                break;
            case 'lineclear':
                url = api_constant_1.API.lineclear + trackingNum;
                break;
            case 'cj':
                url = api_constant_1.API.cj + trackingNum;
                break;
            case 'fedex':
                url = api_constant_1.API.fedex + trackingNum;
                break;
            case 'usps':
                url = api_constant_1.API.usps + trackingNum;
                break;
            case 'mypoz':
                url = api_constant_1.API.mypoz + trackingNum;
                break;
            case 'shopee':
                let time = +Date.parse(new Date().toUTCString());
                url = `${api_constant_1.API.shopee}${trackingNum}&__uatu=${time}`;
                break;
            case 'taqbin':
                url = api_constant_1.API.taqbin + trackingNum;
                break;
            case 'ups':
                url = api_constant_1.API.ups + trackingNum;
                break;
            case 'aramex':
                url = api_constant_1.API.aramex + trackingNum;
                break;
            case 'zepto':
                url = api_constant_1.API.zepto + trackingNum;
                break;
            case 'pgeon':
                url = api_constant_1.API.pgeon + trackingNum;
                break;
            case 'aupost':
                url = api_constant_1.API.aupost + trackingNum;
                break;
            case 'japan_ems':
                url = api_constant_1.API.japan_ems + trackingNum;
                break;
            case 'brazilianpost':
                url = api_constant_1.API.brazilianpost + trackingNum;
                break;
            case 'posindonesia':
                url = api_constant_1.API.posindonesia;
                break;
            case 'tiki':
                url = api_constant_1.API.cekongkir;
                break;
            case 'sicepat':
                url = api_constant_1.API.cekongkir;
                break;
            case 'wahana':
                url = api_constant_1.API.cekongkir;
                break;
            case 'lion':
                url = api_constant_1.API.cekongkir;
                break;
            case 'jne':
                url = api_constant_1.API.jne + trackingNum;
                break;
            case 'redpack':
                url = api_constant_1.API.redpack + trackingNum;
                break;
            case 'tnt':
                url = `${api_constant_1.API.tnt}${trackingNum}&searchType=CON&locale=en_MY&channel=OPENTRACK`;
                break;
            default:
                console.log('No type found, consider it comes from previous version which always poslaju');
                url = `${api_constant_1.API.poslaju}${trackingNum}&culture=EN&dt=${Date.now()}`;
                break;
        }
        return url;
    }
}
exports.ApiChooser = ApiChooser;
//# sourceMappingURL=api-chooser.js.map