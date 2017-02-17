import { WxHttpClient, RequestOptionsArgs, Response } from '../core/util/wx-http-client';


export class UserService {
	constructor(private _http = new WxHttpClient()) {

	}
	async testHttp() {
		let ret = await this._http.get('https://rp14.bizatmobile.com/v1/api/system/location/all');
		return ret;
	}
}
