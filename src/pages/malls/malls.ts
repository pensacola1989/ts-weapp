/// <reference path="../../services/user-service.ts" />
/// <reference path="../../services/mall-service.ts" />

import { WxApiPromise } from '../../core/wx-api-wrapper';
import { IPage, PageBase } from '../../core/page-base';
import { WxPage, viewModel, Watcher } from '../../core/decorators/index';
import { Events } from '../../core/util/events';
import { UserService } from '../../services/user-service'
import { Mall, MallService, Advertise, Parkinginformation } from '../../services/mall-service';
import { groupBy } from '../../utils/util';

let app = getApp();

interface MallItem {
	coverUrl: string;
	title: string;
	category: string;
	location: string;
	isLike: boolean
}

@WxPage
class MallsPage extends PageBase {

	constructor(
		private _mallService = new MallService(),
		private _userService = new UserService(),
		private _events = Events.getInstance(),
		private _api = new WxApiPromise()
	) {
		super();

	}

	private static _pageIndex = 1;
	private static _pageNumber = 100;


	@viewModel
	public selectedCity: any;

	@viewModel
	public mallList: Array<Mall>;

	@viewModel
	public isLoading: boolean = false;

	@viewModel
	scrollHeight: number = 0;

	groupedCity: { [key: string]: any };

	public like(e: TapEvent) {
		let index = e.currentTarget.dataset['index'];
		// this.mallList[index].isLike = !this.mallList[index].isLike;
	}

	public async loadMore() {
		console.log(MallsPage._pageIndex);
		if (this.isLoading) {
			return;
		}
		this.isLoading = true;
		try {
			let loadIndex = MallsPage._pageIndex;
			let ret: KdResponse = await this._mallService.getMallList(this.selectedCity.id, ++loadIndex, MallsPage._pageNumber);
			let loadedMallList: Mall[] = ret.data ? ret.data.malllist : [];

			this.mallList = [].concat(this.mallList, loadedMallList);

			MallsPage._pageIndex++;
		}
		catch (err) {
			console.error('loading error...');
			console.log(err);
		}
		finally {
			this.isLoading = false;
		}
	}

	public gotoDetail(e: TapEvent): void {
		let mallId = e.currentTarget.dataset['id'];
		this._api.WxApi.navigateTo({
			url: `../shop/shop?id=${mallId}`
		});
	}

	public chooseLocation(): void {
		this._api.WxApi.navigateTo({
			url: '../location/location'
		});
	}

	public gotoMap(e: TapEvent): void {
		let lat = e.currentTarget.dataset['lat'];
		let lng = e.currentTarget.dataset['lng'];

		
		this._api.WxApi.openLocation({
			latitude: parseFloat(lat),
			longitude: parseFloat(lng)
		})
	}

	public async onLoad() {
		// let tag = true;
		// if (tag) {
		// 	this._api.WxApi.redirectTo({
		// 		url: '../auth/auth?islogin=1'
		// 	});
		// 	return;
		// }

		this._events.subscribe('city_got', async (city) => {
			this.selectedCity = city;
			let ret: KdResponse = await this._mallService.getMallList(this.selectedCity.id, MallsPage._pageIndex, MallsPage._pageNumber);
			let mallList: Mall[] = ret.data ? ret.data.malllist : [];
			this.mallList = mallList
		});
		try {
			let sysInfo = await this._api.WxApi.getSystemInfo();
			this.scrollHeight = sysInfo.windowHeight;
			let location = await this._api.WxApi.getLocation();
			let latlng = [location.latitude, location.longitude].join(',');
			let address = await this._mallService.DecodeGps(latlng);

			let res = await this._mallService.getLocationMall();
			let data = res.data;

			let groupedCity = groupBy(data, 'title');

			this.groupedCity = groupedCity;

			let gotCity = address.data.result.ad_info.city;

			if (this.groupedCity[gotCity]) {
				this.selectedCity = this.groupedCity[gotCity];
			}
			else {
				this.selectedCity = {
					title: gotCity,
					id: 1
				};
			}

			let ret: KdResponse = await this._mallService.getMallList(this.selectedCity.id, MallsPage._pageIndex, MallsPage._pageNumber);
			let mallList: Mall[] = ret.data ? ret.data.malllist : [];
			this.mallList = mallList
			console.log(mallList);
		}
		catch (e) {
			console.error(e);
		}
		finally {
			console.info('.........finally runs..........')
		}
	}
}
