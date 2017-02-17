import { WxApiPromise } from '../../core/wx-api-wrapper';
import { IPage, PageBase } from '../../core/page-base';
import { WxPage, viewModel, Watcher } from '../../core/decorators/index';
import { Events } from '../../core/util/events';
import { getParameterByName } from '../../utils/util';
import { UserService } from '../../services/user-service'
import { ShopSearchCretira, Shop, MallService, Advertise, Parkinginformation } from '../../services/mall-service';

let app = getApp();

@WxPage
class ShopPage extends PageBase {
	constructor(
		private _mallService = new MallService(),
		private _events = Events.getInstance(),
		private _api = new WxApiPromise()
	) {
		super();
	}

	criteria: ShopSearchCretira;

	@viewModel
	selectIndex: any = {
		floor: 0,
		bis: 0,
		order: 0
	}

	@viewModel
	public filter: any = {
		floorArray: [],
		bisArray: [],
		orderArray: ['全部', '人气最高', '有卡券', '有报名', '有促销优惠', '有排队'],
	}

	@viewModel
	public shopList: Array<Shop>;

	@viewModel
	public isLoading: boolean = false;

	public async bindFloorChange(e: TapEvent) {
		this.selectIndex.floor = e.detail.value;
		this.criteria.floor = this.filter.floorArray[this.selectIndex.floor].floor_id;

		this.doFilter();
	}

	public async bindBisChange(e: TapEvent) {
		this.selectIndex.bis = e.detail.value;
		this.criteria.type = this.filter.bisArray[this.selectIndex.bis].id;

		this.doFilter();
	}

	async doFilter() {
		let res = await this._mallService.searchShop(this.criteria);
		if (res.data.shoplist) {
			res.data.shoplist.forEach(s => s.isLike = false);
		}
		this.shopList = res.data.shoplist ? res.data.shoplist : [];
	}

	public gotoDetail(e: TapEvent) {
		let detailUrl = e.currentTarget.dataset['detail_url'];
		let shopId = getParameterByName('shop_id', detailUrl);
		console.log(shopId);
	}

	public bindOrderChange(e: TapEvent) {
		this.selectIndex.order = this.criteria.sort = e.detail.value;
		this.doFilter();
	}

	public like(e: TapEvent) {
		let index = e.currentTarget.dataset['index'];
		this.shopList[index].isLike = !this.shopList[index].isLike;
	}

	public loadMore() {
		this.isLoading = true;
		setTimeout(() => {
			// this.shopList = [].concat(this.shopList, this.shopList);
			this.isLoading = false;
		}, 1500);
	}

	public async onLoad(query) {
		let mallId: number = query.id;
		try {
			let configP = await Promise.all([
				this._mallService.getFloorInfo(mallId),
				this._mallService.getMerchantclassify()
			]);
			this.filter.floorArray = [{ floor_name: '全部', floor_id: 0 }].concat(< Array < any >> configP[0].data);
			this.filter.bisArray = [{ title: '全部', id: 0 }].concat(< Array < any >> configP[1].data);

			this.criteria = {
				mall_id: mallId,
				type: this.filter.bisArray[this.selectIndex.bis] ? this.filter.bisArray[this.selectIndex.bis].id : 0,
				floor: this.filter.floorArray[this.selectIndex.floor] ? this.filter.floorArray[this.selectIndex.floor].floor_id : 0,
				sort: this.selectIndex.order,
				page: 1,
				pageSize: 10
			}

			this.doFilter();

		}
		catch (e) {
			console.error(e);
		}
		finally {
			console.info('.........finally runs..........')
		}
	}
}
