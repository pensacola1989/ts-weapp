import { WxHttpClient, RequestOptionsArgs, Response } from '../core/util/wx-http-client';
import * as md5 from './md5.js';
// declare function md5(str: string): string;

export interface Shop {
	isLike?: boolean;
	shop_id: number;
	shop_name: string;
	logo_img_url: string;
	remark: string;
	brand_id: number;
	type_name: string;
	type_id: number;
	floor_name: string;
	link_num: number;
	shopdetail_url: string;
	iris_img_url: string;
	easy_img_url: string;
}

export interface ShopSearchCretira {
	mall_id: number;
	floor: number;
	type: number;
	sort?: number;
	key?: string;
	page?: number;
	pageSize?: number;
}

export interface Mall {
	mall_id: number;
	mall_id_des: string;
	mall_name: string;
	mall_logo_img_url: string;
	app_img: string;
	mall_url_prefix: string;
	mall_open_time: string;
	mall_close_time: string;
	mall_remark: string;
	traffic: string;
	lng: number;
	lat: number;
	address: string;
	isFouce: boolean;
	advertisement?: Array<Advertise>;
	appreclist?: any,
	parkinginformation?: Array<Parkinginformation>;
};
export interface Advertise {
	id: number;
	name: string;
	start_time: Date;
	end_time: Date;
	iris_img_url: string;
	easy_img_url: string;
};

export interface Parkinginformation {
	title: string;
	img_url: string;
	contents: string;
}
export interface House {
	house_number_name: string;
	house_number_id: string;
}
export interface Floor {
	house_datas: Array<House>;
	floor_name: string;
	floor_id: number;
}

export class MallService {
	constructor(private _http = new WxHttpClient()) {

	}

	private _buildRequestUrl(api: string): string {
		const dateTime = new Date().getTime();
		const timestamp = Math.floor(dateTime / 1000);
		const nonce = '3dfsd3';
		const fp = 1;

		let str = [timestamp, nonce, api].sort().join('^');
		let hash = md5(str, null, null);
		let retStr = hash.substring(0, 10) + 'Companycn' + hash.substring(10);
		let sn = md5(retStr, null, null);
		let urlTpl = `http://kdmallapipv.companycn.net/CommonAPI/mallshop?tp=${api}&timestamp=${timestamp}&nonce=${nonce}&sn=${sn}&fp=${fp}`
		// let tp = 'loadmalllist';

		return urlTpl;
	}

	public async getMallList(cityId: number = 1, pageIndex: number = 1, pageSize: number = 10): Promise<KdResponse> {
		let url = this._buildRequestUrl('loadmalllist');
		let ret = await this._http.post(url, {
			city: cityId,
			page: pageIndex,
			pageSize: pageSize
		});
		return ret.data;
	}

	public async getLocationMall(): Promise<KdResponse> {
		let url = this._buildRequestUrl('provinceslist');
		let res = await this._http.post(url, {});

		return res.data;
	}

	public async DecodeGps(latlng: string): Promise<WxResponse> {
		let url = `http://apis.map.qq.com/ws/geocoder/v1/?location=${latlng}&key=QDGBZ-SVD3F-RYHJH-JW3WU-MH42F-ENFZH`;
		let res = await this._http.get(url);
		console.log(res);

		return res;
	}

	public async getFloorInfo(mallId: number): Promise<KdResponse> {
		let url = this._buildRequestUrl('mallfloorsinformation');
		let res = await this._http.post(url, { mall_id: mallId });
		return res.data;
	}

	public async getMerchantclassify(): Promise<KdResponse> {
		let url = this._buildRequestUrl('merchantclassify');
		let res = await this._http.post(url, {});

		return res.data;
	}

	public async searchShop(cretira: ShopSearchCretira): Promise<KdResponse> {
		let url = this._buildRequestUrl('loadshoplist');
		let res = await this._http.post(url, cretira);

		return res.data;
	}
}

