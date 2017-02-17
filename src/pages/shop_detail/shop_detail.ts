import { WxApiPromise } from '../../core/wx-api-wrapper';
import { IPage, PageBase } from '../../core/page-base';
import { WxPage, viewModel, Watcher } from '../../core/decorators/index';
import { Events } from '../../core/util/events';
import { getParameterByName } from '../../utils/util';
import { UserService } from '../../services/user-service'
import { ShopSearchCretira, Shop, MallService, Advertise, Parkinginformation } from '../../services/mall-service';

let app = getApp();

@WxPage
class ShopDetailPage extends PageBase {
	constructor(
		private _mallService = new MallService(),
		private _events = Events.getInstance(),
		private _api = new WxApiPromise()
	) {
		super();
	}


	public async onLoad(query) {
		let mallId: number = query.id;
		try {


		}
		catch (e) {
			console.error(e);
		}
		finally {
			console.info('.........finally runs..........')
		}
	}
}
