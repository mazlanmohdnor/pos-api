"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const courier_name_constant_1 = require("./courier-name.constant");
const pos_type_1 = require("./pos.type");
let TypePipe = class TypePipe {
    static transform(type) {
        if (type) {
            switch (type) {
                case 'poslaju':
                    return courier_name_constant_1.COURIER_NAME.poslaju;
                case 'skynet':
                    return courier_name_constant_1.COURIER_NAME.skynet;
                case 'ninjavan':
                    return courier_name_constant_1.COURIER_NAME.ninjavan;
                case 'lex':
                    return courier_name_constant_1.COURIER_NAME.lex;
                case 'jnt':
                    return courier_name_constant_1.COURIER_NAME.jnt;
                case 'gdex':
                    return courier_name_constant_1.COURIER_NAME.gdex;
                case 'citylink':
                    return courier_name_constant_1.COURIER_NAME.citylink;
                case 'lineclear':
                    return courier_name_constant_1.COURIER_NAME.lineclear;
                case 'lwe':
                    return courier_name_constant_1.COURIER_NAME.lwe;
                case 'airpak':
                    return courier_name_constant_1.COURIER_NAME.airpak;
                case 'fedex':
                    return courier_name_constant_1.COURIER_NAME.fedex;
                case 'dhl':
                    return courier_name_constant_1.COURIER_NAME.dhl;
                case 'cj':
                    return courier_name_constant_1.COURIER_NAME.cj;
                case 'abx':
                    return courier_name_constant_1.COURIER_NAME.abx;
                case 'mypoz':
                    return courier_name_constant_1.COURIER_NAME.mypoz;
                case 'shopee':
                    return courier_name_constant_1.COURIER_NAME.shopee;
                case 'taqbin':
                    return courier_name_constant_1.COURIER_NAME.taqbin;
                case 'ups':
                    return courier_name_constant_1.COURIER_NAME.ups;
                case 'zepto':
                    return courier_name_constant_1.COURIER_NAME.zepto;
                case 'tnt':
                    return courier_name_constant_1.COURIER_NAME.tnt;
                case 'pgeon':
                    return courier_name_constant_1.COURIER_NAME.pgeon;
                case 'aramex':
                    return courier_name_constant_1.COURIER_NAME.aramex;
                case 'aupost':
                    return courier_name_constant_1.COURIER_NAME.aupost;
                case 'japan_ems':
                    return courier_name_constant_1.COURIER_NAME.japan_ems;
                case 'usps':
                    return courier_name_constant_1.COURIER_NAME.usps;
                case 'brazilianpost':
                    return courier_name_constant_1.COURIER_NAME.brazilianpost;
                case 'posindonesia':
                    return courier_name_constant_1.COURIER_NAME.posindonesia;
                case 'jne':
                    return courier_name_constant_1.COURIER_NAME.jne;
                case 'tiki':
                    return courier_name_constant_1.COURIER_NAME.tiki;
                case 'sicepat':
                    return courier_name_constant_1.COURIER_NAME.sicepat;
                case 'lion':
                    return courier_name_constant_1.COURIER_NAME.lion;
                case 'wahana':
                    return courier_name_constant_1.COURIER_NAME.wahana;
                case 'dhleco':
                    return courier_name_constant_1.COURIER_NAME.dhleco;
                case 'nationwide':
                    return courier_name_constant_1.COURIER_NAME.nationwide;
                case 'singpost':
                    return courier_name_constant_1.COURIER_NAME.singpost;
                case 'redpack':
                    return courier_name_constant_1.COURIER_NAME.redpack;
                default:
                    return 'Please Select';
            }
        }
    }
};
TypePipe = __decorate([
    common_1.Injectable()
], TypePipe);
exports.TypePipe = TypePipe;
//# sourceMappingURL=type.pipe.js.map