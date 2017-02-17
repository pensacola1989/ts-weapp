import { WxApiPromise } from '../../core/wx-api-wrapper';
import { IPage, PageBase } from '../../core/page-base';
import { WxPage, viewModel, Watcher } from '../../core/decorators/index';
import { Events } from '../../core/util/events';
import { UserService } from '../../services/user-service'
import { Mall, MallService, Advertise, Parkinginformation } from '../../services/mall-service';
import { groupBy } from '../../utils/util';

let app = getApp();

@WxPage
class LocationPage extends PageBase {

    constructor(
        private _mallService = new MallService(),
        private _userService = new UserService(),
        private _events = Events.getInstance(),
        private _api = new WxApiPromise()
    ) {
        super();
    }

    @viewModel
    groupedArea: Array<any>;

    public pickCity(e: TapEvent): void {
        let city = e.currentTarget.dataset['city'];
        this._events.publish('city_got', city);
        this._api.WxApi.navigateBack({ delta: 1 });
    }

    public async onLoad() {

        try {
            let res = await this._mallService.getLocationMall();
            let data = res.data;
            let groupedArea = groupBy(data, 'area');
            let groupedAreaArr = [];
            Object.keys(groupedArea).length && Object.keys(groupedArea).forEach(k => {
                let obj: any = {};
                obj['k'] = k;
                obj['v'] = groupedArea[k];
                groupedAreaArr.push(obj);
            });
            this.groupedArea = groupedAreaArr;
            console.log(this.groupedArea);
        }
        catch (e) {
            console.error(e);
        }
        finally {
            console.info('.........finally runs..........')
        }
    }
}
