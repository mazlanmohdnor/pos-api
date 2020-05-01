export interface ITracking {
    status: string;
    date: string;
    location: string;
}
export declare class CourierService {
    private timeout;
    constructor();
    get(trackingNo: string, type: string): Promise<ITracking[]>;
    private poslaju;
    private jnt;
    private postpost;
    private pdexpress;
    private gdex;
    private abx;
    private shopee;
    private heroku;
    private posindonesia;
    private aupost;
    private cekongkir;
    private airpak;
    private jne;
    private dhl;
}
