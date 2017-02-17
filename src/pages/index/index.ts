import { WxApiPromise } from '../../core/wx-api-wrapper';
import { IPage, PageBase } from '../../core/page-base';
import { WxPage, viewModel, Watcher } from '../../core/decorators/index';
import { Events } from '../../core/util/events';

let apis = new WxApiPromise();
let app = getApp();


interface IndexPageData {
    motto: string;
    userInfo: any;
}


@WxPage
class IndexPage extends PageBase {

    constructor(private _events = Events.getInstance()) {
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
        apis.WxApi.navigateTo({
            url: '../ticket/ticket'
        });
    }

    public gotoMalls() :void {
        apis.WxApi.navigateTo({
            url: '../malls/malls'
        });   
    }

    public bindViewTap(): void {
        this.testStr = 'fuck2';

        this.$set(this.testData, 'motto', 'fuck22222222');
        // this.testData.motto = 'sdfsdf';
        wx.navigateTo({
            url: '../logs/logs'
        });
    }
    @Watcher('testStr')
    public testWatcher(oldVal: any, newVal: any) {
        console.log('watcher callback runs');
        console.log(`%c old value.....${oldVal}.......`, 'color: #aaa;');
        console.log(`%c new value.....${newVal}.......`, 'color: green;');
    }

    public async onLoad() {
        this._events.subscribe('fuck', (a, b) => {
            console.log(a);

            console.log(b);
        });
        console.log('onLoad');
        let info = await app.getUserInfo();
        // this.testData.motto = 'Hello World and I get user Infomation';
        // this.testData.userInfo = info;
        this.testData = {
            motto: 'Hello World and I get user Infomation',
            userInfo: info
        };
        // this.testWatcher('fuck');
    }
}
