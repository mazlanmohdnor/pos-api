import { Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';
import * as random_useragent from 'random-useragent';
import { ApiChooser } from 'src/courier/api-chooser';
import { API } from 'src/courier/api.constant';
import { STORAGE } from 'src/courier/storage.constant';
// import { NgxXml2jsonService } from 'ngx-xml2json';

const convert = require('xml-js');

export interface ITracking {
    status: string,
    date: string,
    location: string
}

@Injectable()
export class CourierService {
    private timeout: number = 10000;
    
    constructor(
        // private ngxXml2jsonService: NgxXml2jsonService
    ) { }
    
    async get(trackingNo: string, type: string): Promise<ITracking[]> {
        switch (type) {
            case 'poslaju':
                return await this.poslaju(trackingNo);
            case 'jnt':
                return await this.jnt(trackingNo);
            case 'nationwide':
            case 'redpack':
            case 'singpost':
            case 'cj':
                return await this.heroku(trackingNo, type);
            case 'skynet':
            case 'citylink':
            case 'lex':
            case 'lwe':
            case 'ninjavan':
            case 'dhleco':
                return await this.postpost(trackingNo, type);
            case 'ups':
            case 'fedex':
            case 'brazilianpost':
            case 'aramex':
            case 'usps':
            case 'japan_ems':
                return await this.pdexpress(trackingNo, type);
            case 'gdex':
                return await this.gdex(trackingNo, type);
            case 'abx':
                return await this.abx(trackingNo, type);
            case 'shopee':
                return await this.shopee(trackingNo, type);
            case 'posindonesia':
                return await this.posindonesia(trackingNo, type);
            case 'aupost':
                return await this.aupost(trackingNo, type);
            case 'tiki':
            case 'sicepat':
            case 'wahana':
            case 'lion':
                return await this.cekongkir(trackingNo, type);
            case 'airpak':
                return await this.airpak(trackingNo, type);
            case 'jne':
                return await this.jne(trackingNo, type);
            case 'dhl':
                return await this.dhl(trackingNo, type);
            // case 'lineclear':
            //     return await this.lineclear(trackingNo, type);
        }
    }
    
    private async poslaju(trackingNo: string): Promise<ITracking[]> {
        let xml = `<v:Envelope xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns:d="http://www.w3.org/2001/XMLSchema" xmlns:c="http://schemas.xmlsoap.org/soap/encoding/" xmlns:v="http://schemas.xmlsoap.org/soap/envelope/">
                    <v:Header />
                    <v:Body>
                        <GetTrackNTraceWebApi xmlns="http://tempuri.org/" id="o0" c:root="1">
                            <cnno i:type="d:string">${ trackingNo }</cnno>
                            <cultureCode i:type="d:string">En</cultureCode>
                        </GetTrackNTraceWebApi>
                    </v:Body>
                </v:Envelope>`;
        
        const headers: AxiosRequestConfig = {
            timeout: this.timeout,
            headers: {
                'Content-Type': 'text/xml',
                'User-Agent': 'ksoap2-android/2.6.0+',
                'SOAPAction': 'http://tempuri.org/IPOSApiService/GetTrackNTraceWebApi'
            }
        };
        
        return new Promise((resolve, reject) => {
            axios.post<AxiosRequestConfig>('https://mobile-app.pos.com.my/API/POSApiService.svc', xml, headers)
                 .then(response => {
                     try {
                         const result1 = convert.xml2json(response.data, {
                             compact: true,
                             captureSpacesBetweenElements: false,
                             trim: true,
                             spaces: 4,
                             ignoreDeclaration: true,
                             ignoreInstruction: true,
                             ignoreAttributes: true,
                             ignoreComment: true,
                             ignoreCdata: true,
                             ignoreDoctype: true
                         });
                    
                         const result = JSON.parse(result1)['s:Envelope']['s:Body']['GetTrackNTraceWebApiResponse']['GetTrackNTraceWebApiResult']['_text'];
                         const parsed: ITracking[] = JSON.parse(result).map((x): ITracking => {
                             return {
                                 status: x.process,
                                 date: x.date,
                                 location: x.office
                             };
                         });
                    
                         if (Array.isArray(parsed)) {
                             if (parsed.length > 0) {
                                 resolve(parsed);
                             } else {
                                 resolve([{
                                     date: new Date().toISOString(),
                                     status: 'No record at the moment, please wait.',
                                     location: ''
                                 }]);
                             }
                         } else {
                             resolve([{
                                 date: new Date().toISOString(),
                                 status: 'No record at the moment, please wait.',
                                 location: ''
                             }]);
                         }
                     } catch (e) {
                         reject('axios response err');
                     }
                 }).catch(err => {
                console.log('postpost error', JSON.stringify(err));
                resolve([{
                    date: new Date().toISOString(),
                    status: 'Server cannot be reached at the moment. Please wait.',
                    location: ''
                }]);
            });
        });
        
    }
    
    private async jnt(trackingNo: string): Promise<ITracking[]> {
        return new Promise((resolve, reject) => {
            axios({
                method: 'POST',
                url: API.jnt,
                timeout: this.timeout,
                headers: {
                    'User-Agent': random_useragent.getRandom((ua) => {
                        return ua.deviceType === 'mobile';
                    })
                },
                data: `method=order.massOrderTrack&format=json&v=1.0&data=%7B%22parameter%22%3A%22%7B%5C%22billCodes%5C%22%3A%5C%22${ trackingNo }%5C%22%2C%5C%22lang%5C%22%3A%5C%22en%5C%22%7D%22%7D`
            }).then(response => {
                const jntData = JSON.parse(response.data.data);
                
                if (Array.isArray(jntData.bills) && jntData.bills[0].details) {
                    let response: ITracking[] = jntData.bills[0].details.map((x): ITracking => {
                        return {
                            date: x.acceptTime,
                            status: x.scanstatus,
                            location: x.state + ', ' + x.city
                        };
                    });
                    
                    if (Array.isArray(response)) {
                        if (response.length > 0) {
                            resolve(response);
                        } else {
                            resolve([{
                                date: new Date().toISOString(),
                                status: 'No record at the moment, please wait.',
                                location: ''
                            }]);
                        }
                    } else {
                        resolve([{
                            date: new Date().toISOString(),
                            status: 'No record at the moment, please wait.',
                            location: ''
                        }]);
                    }
                }
            }).catch(e => {
                console.log('jnt error', JSON.stringify(e));
                resolve([{
                    date: new Date().toISOString(),
                    status: 'Server cannot be reached at the moment. Please wait.',
                    location: ''
                }]);
            });
        });
    }
    
    private async postpost(trackingNo: string, type): Promise<ITracking[]> {
        return new Promise((resolve, reject) => {
            axios({
                method: 'GET',
                timeout: this.timeout,
                url: ApiChooser.chooseApi(type, trackingNo),
                headers: {
                    'token': 'U2FsdGVkX18uP065bo469TuP6hhBRiQ/Ku5+rJdRK0G8nSBPoMUgVPiQHHc99wAlja+HLpgycU9pGdhqHZcG0Q==',
                    'Authorization': 'Bearer Basic YW5kcm9pZDpUbTk3SEprOA==',
                    'User-Agent': random_useragent.getRandom((ua) => {
                        return ua.deviceType === 'mobile';
                    })
                }
            }).then(res => {
                const response = res.data;
                
                if (Array.isArray(response)) {
                    if (response.length > 0) {
                        resolve(response);
                    } else {
                        resolve([{
                            date: new Date().toISOString(),
                            status: 'No record at the moment. Please wait for a while',
                            location: ''
                        }]);
                    }
                } else {
                    resolve([{
                        date: new Date().toISOString(),
                        status: 'No record at the moment. Please wait for a while',
                        location: ''
                    }]);
                }
            }).catch(e => {
                console.log('postpostData:', JSON.stringify(e));
                resolve([{
                    date: new Date().toISOString(),
                    status: 'Server cannot be reached at the moment. Please wait.',
                    location: ''
                }]);
            });
        });
    }
    
    private async pdexpress(trackingNo: string, type): Promise<ITracking[]> {
        return new Promise((resolve, reject) => {
            axios({
                method: 'GET',
                timeout: this.timeout,
                url: ApiChooser.chooseApi(type, trackingNo),
                headers: {
                    'Authorization': STORAGE.PDEXPRESS_KEY,
                    'User-Agent': random_useragent.getRandom((ua) => {
                        return ua.deviceType === 'mobile';
                    })
                }
            }).then(res => {
                let response = res.data;
                
                if (response && response['TrackingInfo'] && response['TrackingInfo']['activityList'] && response['TrackingInfo']['activityList']['PackageActivity']) {
                    
                    if (Array.isArray(response['TrackingInfo']['activityList']['PackageActivity'])) {
                        response = response['TrackingInfo']['activityList']['PackageActivity'].map(x => {
                            return {
                                date: `${ x.date } : ${ x.time }`,
                                status: x.description,
                                location: x.location
                            };
                        });
                    } else {
                        response = [{
                            date: `${ response['TrackingInfo']['activityList']['PackageActivity'].date }: ${ response['TrackingInfo']['activityList']['PackageActivity'].time }`,
                            status: response['TrackingInfo']['activityList']['PackageActivity'].description,
                            location: response['TrackingInfo']['activityList']['PackageActivity'].location
                        }];
                    }
                } else {
                    response = [{
                        date: new Date().toISOString(),
                        status: `${ response['TrackingInfo']['trackingNo'] } : ${ response['TrackingInfo']['errorMessage'] }`,
                        location: ''
                    }];
                }
                
                if (Array.isArray(response)) {
                    if (response.length > 0) {
                        resolve(response);
                    } else {
                        resolve([{
                            date: new Date().toISOString(),
                            status: 'No record at the moment, please wait.',
                            location: ''
                        }]);
                    }
                } else {
                    resolve([{
                        date: new Date().toISOString(),
                        status: 'No record at the moment, please wait.',
                        location: ''
                    }]);
                }
            }).catch(e => {
                console.log('pdexpress:', JSON.stringify(e));
                resolve([{
                    date: new Date().toISOString(),
                    status: 'Server cannot be reached at the moment. Please wait.',
                    location: ''
                }]);
            });
        });
        
    }
    
    private async gdex(trackingNo: string, type): Promise<ITracking[]> {
        return new Promise((resolve, reject) => {
            axios({
                method: 'GET',
                timeout: this.timeout,
                url: ApiChooser.chooseApi(type, trackingNo),
                headers: {
                    'User-Agent': random_useragent.getRandom((ua) => {
                        return ua.deviceType === 'mobile';
                    })
                }
            }).then(res => {
                let response = res.data;
                
                if (response && response['r'] && response['r']['CNDetailstatusList'] && Array.isArray(response['r']['CNDetailstatusList'])) {
                    response = response['r']['CNDetailstatusList'].map(x => {
                        return {
                            date: x.Datescan,
                            status: x.StatusDetail,
                            location: x.Location
                        };
                    });
                }
                
                if (Array.isArray(response)) {
                    if (response.length > 0) {
                        resolve(response);
                    } else {
                        resolve([{
                            date: new Date().toISOString(),
                            status: 'No record at the moment, please wait.',
                            location: ''
                        }]);
                    }
                } else {
                    resolve([{
                        date: new Date().toISOString(),
                        status: 'No record at the moment, please wait.',
                        location: ''
                    }]);
                }
            }).catch(e => {
                console.log('gdex:', JSON.stringify(e));
                resolve([{
                    date: new Date().toISOString(),
                    status: 'Server cannot be reached at the moment. Please wait.',
                    location: ''
                }]);
            });
        });
        
    }
    
    private async abx(trackingNo: string, type: any): Promise<ITracking[]> {
        return new Promise(async (resolve, reject) => {
            await axios({
                method: 'GET',
                timeout: this.timeout,
                url: ApiChooser.chooseApi(type, trackingNo),
                headers: {
                    'User-Agent': random_useragent.getRandom((ua) => {
                        return ua.deviceType === 'mobile';
                    })
                }
            }).then(res => {
                let response = res.data;
                if (Array.isArray(response)) {
                    if (response.length > 0) {
                        resolve(response);
                    } else {
                        resolve([{
                            date: new Date().toISOString(),
                            status: 'No record at the moment, please wait.',
                            location: ''
                        }]);
                    }
                } else {
                    resolve([{
                        date: new Date().toISOString(),
                        status: 'No record at the moment, please wait.',
                        location: ''
                    }]);
                }
            }).catch(e => {
                console.log('abx error:', JSON.stringify(e));
                resolve([{
                    date: new Date().toISOString(),
                    status: 'Server cannot be reached at the moment. Please wait.',
                    location: ''
                }]);
            });
        });
    }
    
    private async shopee(trackingNo: string, type: any): Promise<ITracking[]> {
        return new Promise((resolve, reject) => {
            axios({
                method: 'GET',
                timeout: this.timeout,
                url: ApiChooser.chooseApi(type, trackingNo),
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/82.0.4056.3 Safari/537.36'
                }
            }).then(res => {
                let response = res.data;
                
                // shopee
                if (response && response.data && Array.isArray(response.data.tracking_list)) {
                    response = response.data.tracking_list.map(x => {
                        return {
                            date: new Date(x.timestamp * 1000).toISOString().slice(0, 19).replace('T', ' '),
                            status: x.message,
                            location: ''
                        };
                    });
                }
                
                if (Array.isArray(response)) {
                    if (response.length > 0) {
                        resolve(response);
                    } else {
                        resolve([{
                            date: new Date().toISOString(),
                            status: 'No record at the moment, please wait.',
                            location: ''
                        }]);
                    }
                } else {
                    resolve([{
                        date: new Date().toISOString(),
                        status: response.message.includes('pattern') ? 'Invalid Tracking Number.' : response.message || 'Invalid',
                        location: ''
                    }]);
                }
            }).catch(e => {
                console.log('shopee:', JSON.stringify(e));
                resolve([{
                    date: new Date().toISOString(),
                    status: 'Server cannot be reached at the moment. Please wait.',
                    location: ''
                }]);
            });
        });
    }
    
    private async heroku(trackingNo: string, type): Promise<ITracking[]> {
        return new Promise((resolve, reject) => {
            axios({
                method: 'GET',
                timeout: this.timeout,
                url: ApiChooser.chooseApi(type, trackingNo),
                headers: {
                    'User-Agent': random_useragent.getRandom((ua) => {
                        return ua.deviceType === 'mobile';
                    })
                }
            }).then(res => {
                let response = res.data;
                if (Array.isArray(response)) {
                    if (response.length > 0) {
                        resolve(response);
                    } else {
                        resolve([{
                            date: new Date().toISOString(),
                            status: 'No record at the moment, please wait.',
                            location: ''
                        }]);
                    }
                } else {
                    resolve([{
                        date: new Date().toISOString(),
                        status: 'No record at the moment, please wait.',
                        location: ''
                    }]);
                }
            }).catch(e => {
                console.log('error', type, JSON.stringify(e));
                resolve([{
                    date: new Date().toISOString(),
                    status: 'Server cannot be reached at the moment. Please wait.',
                    location: ''
                }]);
            });
        });
    }
    
    private async posindonesia(trackingNo: string, type: any): Promise<ITracking[]> {
        return new Promise((resolve, reject) => {
            axios({
                method: 'POST',
                timeout: this.timeout,
                url: ApiChooser.chooseApi(type, trackingNo),
                headers: {
                    'User-Agent': random_useragent.getRandom((ua) => {
                        return ua.deviceType === 'mobile';
                    })
                },
                data: {
                    'courier': 'pos',
                    'waybill': trackingNo
                }
            }).then(res => {
                let response = res.data;
                
                if (response && response['data'] && response['data']['result'] && response['data']['result']['manifest']) {
                    if (Array.isArray(response['data']['result']['manifest'])) {
                        response = response['data']['result']['manifest'].map(x => {
                            return {
                                date: x.manifest_date + ' : ' + x.manifest_time,
                                status: x.manifest_description,
                                location: x.city_name
                            };
                        });
                    }
                }
                
                
                if (Array.isArray(response)) {
                    if (response.length > 0) {
                        resolve(response);
                    } else {
                        resolve([{
                            date: new Date().toISOString(),
                            status: 'No record at the moment, please wait.',
                            location: ''
                        }]);
                    }
                } else {
                    resolve([{
                        date: new Date().toISOString(),
                        status: 'No record at the moment, please wait.',
                        location: ''
                    }]);
                }
            }).catch(e => {
                console.log('posindonesia', type, JSON.stringify(e));
                resolve([{
                    date: new Date().toISOString(),
                    status: 'Server cannot be reached at the moment. Please wait.',
                    location: ''
                }]);
            });
        });
    }
    
    private async aupost(trackingNo: string, type: any): Promise<ITracking[]> {
        return new Promise((resolve, reject) => {
            axios({
                method: 'GET',
                timeout: this.timeout,
                url: ApiChooser.chooseApi(type, trackingNo),
                headers: {
                    'User-Agent': random_useragent.getRandom((ua) => {
                        return ua.deviceType === 'mobile';
                    }),
                    'AUTH-KEY': STORAGE.AUSPOST_KEY
                }
            }).then(res => {
                let response = res.data;
                
                if (response && response['QueryTrackEventsResponse'] && response['QueryTrackEventsResponse']['TrackingResult']
                    && response['QueryTrackEventsResponse']['TrackingResult']['ArticleDetails'] && response['QueryTrackEventsResponse']['TrackingResult']['ArticleDetails']['Events']
                    && response['QueryTrackEventsResponse']['TrackingResult']['ArticleDetails']['Events']['Event']) {
                    if (Array.isArray(response['QueryTrackEventsResponse']['TrackingResult']['ArticleDetails']['Events']['Event'])) {
                        response = response['QueryTrackEventsResponse']['TrackingResult']['ArticleDetails']['Events']['Event'].map(x => {
                            return {
                                date: x.EventDateTime,
                                status: x.EventDescription,
                                location: x.Location
                            };
                        });
                    }
                }
                
                
                if (Array.isArray(response)) {
                    if (response.length > 0) {
                        resolve(response);
                    } else {
                        resolve([{
                            date: new Date().toISOString(),
                            status: 'No record at the moment, please wait.',
                            location: ''
                        }]);
                    }
                } else {
                    resolve([{
                        date: new Date().toISOString(),
                        status: 'No record at the moment, please wait.',
                        location: ''
                    }]);
                }
            }).catch(e => {
                console.log('posindonesia', type, JSON.stringify(e));
                resolve([{
                    date: new Date().toISOString(),
                    status: 'Server cannot be reached at the moment. Please wait.',
                    location: ''
                }]);
            });
        });
    }
    
    private async cekongkir(trackingNo: string, type: any): Promise<ITracking[]> {
        return new Promise((resolve, reject) => {
            axios({
                method: 'POST',
                timeout: this.timeout,
                url: ApiChooser.chooseApi(type, trackingNo),
                headers: {
                    'User-Agent': random_useragent.getRandom((ua) => {
                        return ua.deviceType === 'mobile';
                    }),
                    key: 'Mb4HmuKuTuQP@K@3'
                },
                data: {
                    'courier': type,
                    'resi': trackingNo
                }
            }).then(res => {
                let response = res.data;
                console.log(response);
                if (response && response['rajaongkir'] && response['rajaongkir']['result'] && response['rajaongkir']['result']['manifest']) {
                    if (Array.isArray(response['rajaongkir']['result']['manifest'])) {
                        response = response['rajaongkir']['result']['manifest'].map(x => {
                            return {
                                date: x.manifest_date + ' : ' + x.manifest_time,
                                status: x.manifest_description,
                                location: x.city_name
                            };
                        });
                    }
                }
                
                
                if (Array.isArray(response)) {
                    if (response.length > 0) {
                        resolve(response);
                    } else {
                        resolve([{
                            date: new Date().toISOString(),
                            status: 'No record at the moment, please wait.',
                            location: ''
                        }]);
                    }
                } else {
                    resolve([{
                        date: new Date().toISOString(),
                        status: 'No record at the moment, please wait.',
                        location: ''
                    }]);
                }
            }).catch(e => {
                console.log('posindonesia', type, JSON.stringify(e));
                resolve([{
                    date: new Date().toISOString(),
                    status: 'Server cannot be reached at the moment. Please wait.',
                    location: ''
                }]);
            });
        });
    }
    
    private async airpak(trackingNo: string, type: any): Promise<ITracking[]> {
        return new Promise((resolve, reject) => {
            axios({
                method: 'POST',
                timeout: this.timeout,
                url: ApiChooser.chooseApi(type, trackingNo),
                data: {
                    'action': 'gettrack',
                    'cn': trackingNo,
                    'stid': 'airpak'
                }
            }).then(res => {
                let response = res.data;
                console.log(res);
                if (response && response.TrackingDetails && Array.isArray(response.TrackingDetails)) {
                    response = response.TrackingDetails.map(x => {
                        return {
                            date: x.TrackingDisplayDate + ' : ' + x.TrackingDisplayTime,
                            status: x.TrackingEventName,
                            location: x.TrackingLocation
                        };
                    });
                }
                
                
                if (Array.isArray(response)) {
                    if (response.length > 0) {
                        resolve(response);
                    } else {
                        resolve([{
                            date: new Date().toISOString(),
                            status: 'No record at the moment, please wait.',
                            location: ''
                        }]);
                    }
                } else {
                    resolve([{
                        date: new Date().toISOString(),
                        status: 'No record at the moment, please wait.',
                        location: ''
                    }]);
                }
            }).catch(e => {
                console.log('posindonesia', type, JSON.stringify(e));
                resolve([{
                    date: new Date().toISOString(),
                    status: 'Server cannot be reached at the moment. Please wait.',
                    location: ''
                }]);
            });
        });
    }
    
    private async jne(trackingNo: string, type: any): Promise<ITracking[]> {
        return new Promise((resolve, reject) => {
            axios({
                method: 'POST',
                timeout: this.timeout,
                url: ApiChooser.chooseApi(type, trackingNo),
                headers: {
                    'User-Agent': random_useragent.getRandom((ua) => {
                        return ua.deviceType === 'mobile';
                    })
                },
                data: {
                    'username': STORAGE.JNE_USERNAME,
                    'api_key': STORAGE.JNE_KEY
                }
            }).then(res => {
                let response = res.data;
                console.log(response);
                if (response && response['history']) {
                    if (Array.isArray(response['history'])) {
                        response = response['history'].map(x => {
                            return {
                                date: x.date,
                                status: x.desc,
                                location: undefined
                            };
                        });
                    }
                }
                
                
                if (Array.isArray(response)) {
                    if (response.length > 0) {
                        resolve(response);
                    } else {
                        resolve([{
                            date: new Date().toISOString(),
                            status: 'No record at the moment, please wait.',
                            location: ''
                        }]);
                    }
                } else {
                    resolve([{
                        date: new Date().toISOString(),
                        status: 'No record at the moment, please wait.',
                        location: ''
                    }]);
                }
            }).catch(e => {
                console.log('posindonesia', type, JSON.stringify(e));
                resolve([{
                    date: new Date().toISOString(),
                    status: 'Server cannot be reached at the moment. Please wait.',
                    location: ''
                }]);
            });
        });
    }
    
    private async dhl(trackingNo: string, type: any): Promise<ITracking[]> {
        return new Promise((resolve, reject) => {
            axios({
                method: 'GET',
                timeout: this.timeout,
                url: ApiChooser.chooseApi(type, trackingNo),
                headers: {
                    'User-Agent': random_useragent.getRandom((ua) => {
                        return ua.deviceType === 'mobile';
                    })
                }
            }).then(res => {
                let response = res.data;
                
                if (response && response.results && Array.isArray(response.results)) {
                    response = response.results[0].checkpoints.map(x => {
                        return {
                            date: x.date + ' : ' + x.time,
                            status: x.description,
                            location: x.location
                        };
                    });
                }
                
                if (Array.isArray(response)) {
                    if (response.length > 0) {
                        resolve(response);
                    } else {
                        resolve([{
                            date: new Date().toISOString(),
                            status: 'No record at the moment, please wait.',
                            location: ''
                        }]);
                    }
                } else {
                    resolve([{
                        date: new Date().toISOString(),
                        status: 'No record at the moment, please wait.',
                        location: ''
                    }]);
                }
            }).catch(e => {
                console.log('posindonesia', type, JSON.stringify(e));
                resolve([{
                    date: new Date().toISOString(),
                    status: 'Server cannot be reached at the moment. Please wait.',
                    location: ''
                }]);
            });
        });
    }
    
    // private async lineclear(trackingNo: string, type: any): Promise<ITracking[]> {
    //     return new Promise((resolve, reject) => {
    //         axios({
    //             method: 'GET',
    //             url: ApiChooser.chooseApi(type, trackingNo),
    //             headers: {
    //                 'User-Agent': random_useragent.getRandom((ua) => {
    //                     return ua.deviceType === 'mobile';
    //                 })
    //             }
    //         }).then(res => {
    //             let response = res.data;
    
    //             const parser = new DOMParser();
    //             const xml = parser.parseFromString(response, 'text/xml');
    //             const obj: any = this.ngxXml2jsonService.xmlToJson(xml);
    //             console.log(obj);
    //             if (obj && obj.ArrayOfConsignmentTrack && Array.isArray(obj.ArrayOfConsignmentTrack.ConsignmentTrack)) {
    //                 response = obj.ArrayOfConsignmentTrack.ConsignmentTrack.map(x => {
    //                     return {
    //                         date: x.EVENTDATE + ' : ' + x.EVENTTIME,
    //                         status: x.ACTIVITY,
    //                         location: x.TRANSIT_LOCATION
    //                     };
    
    //                 });
    //             }
    
    //             if (Array.isArray(response)) {
    //                 if (response.length > 0) {
    //                     resolve(response);
    //                 } else {
    //                     resolve([{
    //                         date: new Date().toISOString(),
    //                         status: 'No record at the moment, please wait.',
    //                         location: ''
    //                     }]);
    //                 }
    //             } else {
    //                 resolve([{
    //                     date: new Date().toISOString(),
    //                     status: 'No record at the moment, please wait.',
    //                     location: ''
    //                 }]);
    //             }
    //         }).catch(e => {
    //             console.log('posindonesia', type, JSON.stringify(e));
    //             resolve([{
    //                date: new Date().toISOString(),
    //                status: 'Server cannot be reached at the moment. Please wait.',
    //                location: ''
    //            }]);
    //         });
    //     });
    // }
}
