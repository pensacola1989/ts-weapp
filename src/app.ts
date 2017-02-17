import { WxHttpClient, RequestOptionsArgs, Response } from './core/util/wx-http-client';
import { WxApiPromise } from './core/wx-api-wrapper';

let apiEntry = new WxApiPromise().WxApi;
WxHttpClient.Interceptors.push({
	request: (req: RequestOptionsArgs) => {

		req.header = {
			'Content-Type': 'application/x-www-form-urlencoded',
			'X-ETMS-UserToken': 'test'
		};
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

	globalData: any = {
		userInfo: null
	}

	onLaunch() {
		//调用API从本地缓存中获取数据
		let logs: any = wx.getStorageSync('logs');
		if (!Array.isArray(logs)) {
			logs = [];
		}
		(<any[]>logs).unshift(Date.now());
		wx.setStorageSync('logs', logs);
	}

	async getUserInfo() {
		if (this.globalData.userInfo) {
			return Promise.resolve(this.globalData.userInfo);
		}
		else {
			await apiEntry.login();
			let userResp = await apiEntry.getUserInfo();
			this.globalData.userInfo = userResp.userInfo;
			return this.globalData.userInfo;
		}
	}
}

App(new AppClass());