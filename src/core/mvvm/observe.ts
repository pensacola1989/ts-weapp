import { Helper } from '../util/index';
import { Events } from '../util/events';

export namespace Mvvm {

	export class ObserveManage {

		private _event: Events;

		// private _watchKeys: Array<string> = [];
		// private _wxPageInstance: any;

		// constructor(pageInstance) {
		constructor(
			private _updateChannel,
			private _watchChannel,
			private _watchKeys
		) {
			// this._wxPageInstance = pageInstance;
			this._event = Events.getInstance();
		}


		private _arrayChange(arr, key, method, newVal): void {
			let newData = {};
			newData[key] = arr;
			arr.length && arr.forEach((item, index) => {
				this.observe(item, arr, `[${index}]`);
			});
			// this._wxPageInstance.setData(newData);
			this._processWatch(key, arr, newVal);
			this._event.publish(this._updateChannel, newData);
		};


		private _observeArray(arr: any[], arrKey: string) {
			let that = this;
			let arrayProto = Array.prototype;
			let arrayMethods = Object.create(arrayProto);
			const methods = 'push|pop|shift|unshift|splice|sort|reverse'.split('|');
			methods.forEach((method) => {
				Helper.def(arrayMethods, method, function () {
					let len = arguments.length;
					let original = arrayProto[method];
					let args = new Array(len);
					while (len--) {
						args[len] = arguments[len];
					}
					let result = original.apply(this, args);

					that._arrayChange(this, arrKey, method, args);
					return result;
				});
			});
			arr['__proto__'] = arrayMethods;
			// observe array items
			arr.length && arr.forEach((obj, arrIndex) => this.observe(obj, arr, `[${arrIndex}]`));
			return;
		}

		public observe(val: any, parent: any, key?: string) {
			if (!val || !Helper.isObject(val)) {
				return;
			}
			let that = this;
			let updateKey, depObj = parent;
			if (Array.isArray(parent)) {
				updateKey = `${parent['__DEP_OBJ_PATH__']}${key}`;
				Helper.def(val, '__DEP_OBJ_PATH__', updateKey);
				depObj = val;
			}
			else if (key) {
				updateKey = !parent['__DEP_OBJ_PATH__'] ? key : `${parent['__DEP_OBJ_PATH__']}.${key}`;
				Helper.def(val, '__DEP_OBJ_PATH__', updateKey);
				depObj = val;
			}
			if (Array.isArray(val)) {
				this._observeArray(val, key);
				return;
			}

			let keys = Object.keys(val);
			keys.length && keys.forEach(k => this._reactive(depObj, k, val[k]));
		}

		// public setWatchers(watchKeys: Array<string>) {
		// 	if (watchKeys) {
		// 		this._watchKeys = watchKeys;
		// 	}
		// }

		private _processWatch(watchKey: string, oldVal: any, newVal: any) {
			if (this._watchKeys.indexOf(watchKey) !== -1) {
				this._event.publish(this._watchChannel, watchKey, oldVal, newVal);
			}
		}

		/**
		 * 构建微信上层的Observers,在observers里触发setData
		 * @param {Object}     target 构造对象(根级为Page)
		 * @param {string}     key    属性名称	
		 * @param {any}     val    初始值
		 */
		private _reactive(target: Object, key: string, val: any): void {

			const property = Object.getOwnPropertyDescriptor(target, key);

			const getter = property && property.get;
			const setter = property && property.set;


			let initVal = {};
			let updateKey = !target['__DEP_OBJ_PATH__'] ? key : `${target['__DEP_OBJ_PATH__']}.${key}`;
			initVal[updateKey] = val;
			// 初始化值
			// this._wxPageInstance.setData(initVal);
			// this._event.publish(this._updateChannel, initVal);
			// 给值做gettersetter操作
			this.observe(val, target, key);

			let that = this;
			Object.defineProperty(target, key, {
				get: function () {
					const value = getter ? getter.apply(target) : val;
					// console.log('%c.....getting property.....', 'color: green;');
					return value;

				},
				set: function (newVal) {
					that._processWatch(key, val, newVal);
					// that._event.publish(that._watchChannel, )
					// this._event.publish('watcherTrigger', modelKeyPath, oldVal, newVal);

					const value = getter ? getter.call(target) : val;
					if (newVal === value || (newVal !== newVal && value !== value)) {
						return
					}
					// console.log('%c.....setting property.....', 'color: red;');
					if (setter) {
						setter.apply(target, newVal);
					}
					else {
						val = newVal;
					}

					let newData = {};
					let updateKey = !this.__DEP_OBJ_PATH__ ? key : `${this.__DEP_OBJ_PATH__}.${key}`;
					newData[updateKey] = newVal;

					let child = newVal;
					// that._wxPageInstance.setData(newData);
					that._event.publish(that._updateChannel, newData);
					that.observe(child, this, key);
				}
			});
			// this._event.publish(this._updateChannel, initVal);
			target[key] = val;
		}
	}
}