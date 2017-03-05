import { WxHttpClient, RequestOptionsArgs, Response } from './core/util/wx-http-client';
import { WxApiPromise } from './core/wx-api-wrapper';
import { Events } from './core/util/events';

let apiEntry = new WxApiPromise().WxApi;
const _event = Events.getInstance();

WxHttpClient.Interceptors.push({
	request: (req: RequestOptionsArgs) => {
		req.header = {
			'Content-Type': 'application/x-www-form-urlencoded'
		};
		const exceptUrl = ['test'];
		let hasExcept = exceptUrl.filter(u => req.url.indexOf(u) !== -1);

		let sKey = apiEntry.getStorageSync('sKey');
		if (!sKey && hasExcept.length) {
			_event.publish('UNAUTH');
		}
		(req.header as any)['sKey'] = sKey;

		apiEntry.showToast({
			title: '加载中',
			icon: 'loading',
			duration: 10000
		});
		return req;
	},
	response: (res: Response) => {
		console.log('%c................pendingRequest...............', 'color: lightgreen;');
		console.log(WxHttpClient.PendingRequests.length);
		if (WxHttpClient.PendingRequests.length < 1) {
			apiEntry.hideToast();
		}
		return res;
	},
	responseError: (err) => {
		if (WxHttpClient.PendingRequests.length < 1) {
			apiEntry.hideToast();
			console.error('err occurs from interceptor');
		}

		return err;
	}
});

class AppClass {

	constructor(
		private _httpClient = new WxHttpClient()
	) {

	}

	globalData: any = {
		userInfo: null
	}

	async onLaunch() {
		_event.subscribe('UNAUTH', async () => {
			console.log('unauthorized');
			let loginRet = await apiEntry.login();
			let uResp = await apiEntry.getUserInfo();
			console.log(uResp);
			let thirdSession = await this._httpClient.post(`http://localhost:3000/session/code/${loginRet.code}`, uResp);
			apiEntry.setStorageSync('sKey', thirdSession.data.sKey);
		});
		//调用API从本地缓存中获取数据
		let logs: any = wx.getStorageSync('logs');
		if (!Array.isArray(logs)) {
			logs = [];
		}
		(<any[]>logs).unshift(Date.now());
		wx.setStorageSync('logs', logs);
		// try {
		// 	let sStatus = await apiEntry.checkSession();
		// 	if (sStatus.errMsg !== 'checkSession:ok') {
		// 		throw Error('session is out of date');
		// 	}
		// 	let d = await apiEntry.getStorage({ key: 'sKey' });
		// 	console.log(d.data);
		// }
		// catch (err) {
		// 	let loginRet = await apiEntry.login();
		// 	let uResp = await apiEntry.getUserInfo();
		// 	console.log(uResp);
		// 	let thirdSession = await this._httpClient.post(`http://localhost:3000/session/${loginRet.code}`, uResp);
		// 	apiEntry.setStorage({
		// 		key: 'sKey',
		// 		data: thirdSession.data.sKey
		// 	});
		// 	// console.error(err);
		// }
		// finally {
		// 	console.info('check session complete');
		// }
	}

	async getUserInfo() {
		if (this.globalData.userInfo) {
			return Promise.resolve(this.globalData.userInfo);
		}
		else {
			// await apiEntry.login();
			console.log('.........');
			let userResp = await apiEntry.getUserInfo();
			console.log(userResp);
			this.globalData.userInfo = userResp.userInfo;
			return this.globalData.userInfo;
		}
	}
}

App(new AppClass());