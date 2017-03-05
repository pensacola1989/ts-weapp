import { WxApiPromise } from '../../core/wx-api-wrapper';
import { IPage, PageBase } from '../../core/page-base';
import { WxPage, viewModel, Watcher } from '../../core/decorators/index';
import { Events } from '../../core/util/events';
import { WxHttpClient , RequestOptionsArgs} from '../../core/util/wx-http-client';
let apiEntry = new WxApiPromise().WxApi;
let app = getApp();


interface IndexPageData {
    motto: string;
    userInfo: any;
}


@WxPage
class IndexPage extends PageBase {

    constructor(
        private _events = Events.getInstance(),
        private _httpClient = new WxHttpClient()
    ) {
        super();
    }



    @viewModel
    testData: IndexPageData = {
        motto: 'Hello World',
        userInfo: {}
    }
    // @viewModel
    // fucks: any[] = [];
    @viewModel
    testStr: string = 'fuck';
    // @viewModel
    // testData: any = {
    //     motto: 'Hello World'
    // }

    public gotoTicket(): void {
        apiEntry.navigateTo({
            url: '../ticket/ticket'
        });
    }

    public gotoMalls(): void {
        apiEntry.navigateTo({
            url: '../malls/malls'
        });
    }

    public bindViewTap(): void {
        this.testStr = 'fuck2';

        this.$set(this.testData, 'motto', 'fuck22222222');
        wx.navigateTo({
            url: '../logs/logs'
        });
    }
    // @Watcher('testStr')
    // public testWatcher(oldVal: any, newVal: any) {
    //     console.log('watcher callback runs');
    //     console.log(`%c old value.....${oldVal}.......`, 'color: #aaa;');
    //     console.log(`%c new value.....${newVal}.......`, 'color: green;');
    // }

    public async onLoad() {
        // this._events.subscribe('fuck', (a, b) => {
        //     console.log(a);
        //     console.log(b);
        // });
        console.log('onLoad');
        // let ret = await apiEntry.login();
        // let info = await apiEntry.getUserInfo();
        
        // let auth = await this._httpClient.post(`http://localhost:3000/session/${ret.code}`, info);
        // let testHeader = await this._httpClient.get('http://localhost:3000/session/test', <RequestOptionsArgs>{
        //     header: {
        //         fuck: 'you'
        //     }
        // });
        let ret = await this._httpClient.get('http://localhost:3000/session/test');
        console.log(ret);
        // this.testData = {
        //     motto: 'Hello World and I get user Infomation',
        //     userInfo: info
        // };

    }
}
