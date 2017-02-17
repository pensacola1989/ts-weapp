/**
 * decorator's namespace
 */
import { Mvvm } from './mvvm/observe';
import { Events, Helper } from './util/index';
import { INJECT_MODEL_KEYS, INJECT_WX_PAGE_INSTANCE_KEY, INJECT_WATCH_KEYS } from './util/constants';

export namespace WxDecorators {

	export class WxPage {

		private _events: Events;

		private _onLoadRef: Function;

		private _pageInstance: any;

		private _wxPageInstance: any;

		private _pageViewModelKeys: string[];

		constructor(target: any) {
			this._pageInstance = this._construct(target, null);
			this._injectWxOnload();
			this._events = Events.getInstance();

		}

		public get WrappedPageInstance(): any {
			return this._pageInstance;
		}

		private _construct(constructor, args) {
			let c: any = function () {
				return constructor.apply(this, args);
			}
			c.prototype = constructor.prototype;

			return new c();
		}

		private _injectWxOnload() {
			let that = this;
			if (!this._pageInstance)
				throw 'page instance not created';

			this._onLoadRef = this._pageInstance.onLoad;
			this._pageInstance.onLoad = function (query) {
				console.log('%c............query...........', 'color: orange');
				console.log(query);
				// 从微信这个钩子偷来page对象放在自己的对象当中
				that._wxPageInstance = this;
				that['__PAGE__'] = this;

				let id = Helper.guid();
				let updateChannel = `update-${id}`;
				let watchChannel = `watch-${id}`;
				that._events.subscribe(updateChannel, (data: any) => {
					that._wxPageInstance.setData(data);
				});

				that._events.subscribe(watchChannel, (modelPathKey, oldVal, newVal) => {
					let watchCb = this['$__WATCHER_CALLBACKS__'][modelPathKey];
					Helper.isFunction(this[watchCb]) && this[watchCb](oldVal, newVal);

				});

				that._pageViewModelKeys = this[INJECT_MODEL_KEYS] || [];

				// get watchers key path
				let watcherKeys = this[INJECT_WATCH_KEYS] || [];

				// merge keys values to a object
				let mergeData = {};
				that._pageViewModelKeys.map(vmk => {
					mergeData[vmk] = this[vmk];
				});
				// 初始化setData 刷新视图
				this.setData(mergeData);
				this['__ROOT_DATA__'] = mergeData;
				// reactive setter 触发的时候通过event回调来做视图刷新

				let observeManage = new Mvvm.ObserveManage(updateChannel, watchChannel, watcherKeys);
				observeManage.observe(mergeData, this);
				// observeManage.setWatchers(watcherKeys);
				// run onLoad hook, if onLoad method has defined in the page class before
				(!!that._onLoadRef && Helper.isFunction(that._onLoadRef)) && that._onLoadRef.apply(this, [query]);
			}
		}
	}
}
