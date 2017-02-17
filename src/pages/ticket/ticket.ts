import { WxApiPromise } from '../../core/wx-api-wrapper';
import { IPage, PageBase } from '../../core/page-base';
import { WxPage, viewModel, Watcher } from '../../core/decorators/index';
import { Events } from '../../core/util/events';

let apis = new WxApiPromise();
let app = getApp();




@WxPage
class TicketPage extends PageBase {

	@viewModel
	private uploadedUrl: string;

	private imageConfig: WXChooseImageObj = {
		count: 1,
		sizeType: ['original'],
		sourceType: ['camera']
	}

    constructor(private _events = Events.getInstance()) {
        super();
    }

	public async takePhoto() {
		try	{
			let ret = await apis.WxApi.chooseImage(this.imageConfig);
			if (ret.tempFilePaths.length) {
				this.uploadedUrl = ret.tempFilePaths[0];
			}
		}
		catch(err) {
			console.log(err);
		}
	}

	public preivewPhoto() {
		let previewConfig: WXPreviewImageObj = {
			urls: [this.uploadedUrl]
		};
		apis.WxApi.previewImage(previewConfig);
	}

    public async onLoad() {
    
    }
}
