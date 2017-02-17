
const EXCLUDE_PROMISE_API = [
	'clearStorage',
	'hideToast',
	'showNavigationBarLoading',
	'hideNavigationBarLoading',
	'drawCanvas',
	'canvasToTempFilePath',
	'hideKeyboard'
];

export class WxApiPromise {

	private _wxApi: any = wx;

	private _wrappedApi: any = {};

	get WxApi(): WXMergedAPI {
		return this._wrappedApi;
	}

	constructor() {
		this._wrapperApi();
	}

	private _canNotPromisable(apiKey: string) {
		return EXCLUDE_PROMISE_API.indexOf(apiKey) !== -1
			|| /^(on|create|stop|pause|close)/.test(apiKey)
			|| /\w+Sync$/.test(apiKey);
	}

	private _wrapperApi() {

		Object.keys(this._wxApi).forEach((apiKey) => {
			if (this._canNotPromisable(apiKey)) {
				this._wrappedApi[apiKey] = (...args) => this._wxApi[apiKey].apply(this._wrappedApi, args);
				return;
			}
			this._wrappedApi[apiKey] = (object) => {
				let obj = object || {};
				return new Promise((resolve, reject) => {
					obj.success = resolve;	
					obj.fail = (res) => {
						if (res && res.errMsg) {
							reject(new Error(res.errMsg));
						} else {
							reject(res);
						}
					};
					this._wxApi[apiKey](obj);
				});
			}
		});
	}
}