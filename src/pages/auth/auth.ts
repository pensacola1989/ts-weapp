/// <reference path="../../services/user-service.ts" />
/// <reference path="../../services/mall-service.ts" />

import { WxApiPromise } from '../../core/wx-api-wrapper';
import { IPage, PageBase } from '../../core/page-base';
import { WxPage, viewModel, Watcher } from '../../core/decorators/index';
import { Events } from '../../core/util/events';
import { UserService } from '../../services/user-service'
import { Mall, MallService, Advertise, Parkinginformation } from '../../services/mall-service';

let app = getApp();

@WxPage
class AuthPage extends PageBase {
	constructor(
		private _mallService = new MallService(),
		private _events = Events.getInstance(),
		private _api = new WxApiPromise()
	) {
		super();
	}

	@viewModel
	isFocus: number;

	// @viewModel
	// isLogin: boolean;

	public inputFocus(e: TapEvent): void {
		let index = e.currentTarget.dataset['index'];
		this.isFocus = index;
	}

	public inputBlur(e: TapEvent): void {
		this.isFocus = -1;
	}

	public async onLoad(query) {
		// this.isLogin = query.islogin;
		console.log('fuck');
	}
}
