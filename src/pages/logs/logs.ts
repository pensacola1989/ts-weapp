import { formatTime } from "../../utils/util";
import { PageBase } from '../../core/page-base';
import { WxPage, Watcher, viewModel } from '../../core/decorators/index';
import { Events } from '../../core/util/events';

@WxPage
class logsPage extends PageBase {
	private _events: Events;
	// data:any = {
	// 	logs: []
	// }
	@viewModel
	logs: any[] = [];


	@viewModel
	isGreater: boolean = false;

	@Watcher('logs')
	fuckWatch(oldVal: Array<any>, newVal: Array<any>) {
		if (this.logs.length > 0) {
			console.log('fuck you');
			this.isGreater = true;
		}
	}

	constructor() {
		super();
		this._events = Events.getInstance();
	}

	add() {
		this.logs.push('log3');
	}

	sub() {
		this._events.unsubscribe('fuck');
		this.logs.pop();
	}

	changeArr() {
		this._events.publish('fuck', 'name', 'you');
		this.logs[0].text = 'fuck';
		this.$set(this.logs, 0, { text: 'modify array' });
		// this.setData({ 'logs[0]': 'fuck'});
		// this.logs[0] = 'fuck';
	}

	public onLoad() {
		this.logs.push({
			text: 'this is a pushed item'
		});
		console.log(this.logs);
		// this.logs = [
		// 	{
		// 		text: 'this is log 1'
		// 	}
		// ];
		// this.logs = [
		// 	'log1', 'log2'
		// ];
		// this.logs[0] = 'fuck';
		// this.logs = ((wx.getStorageSync("logs") as Array<any>) || []).map((log) => { return formatTime(new Date(log)); });
		// this.setData({
		// 	logs: ((wx.getStorageSync("logs") as Array<any>) || []).map((log) => { return formatTime(new Date(log)); })
		// });

		// wx.showModal({
		// 	title: '提示',
		// 	content: '这是一个模态弹窗',
		// 	success: function(res) {
		// 		if (res.confirm) {
		// 			console.log('用户点击确定')
		// 		}
		// 	}
		// });
	}
}