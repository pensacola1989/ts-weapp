export * from './events';

export class Helper {
	public static Id() {
		// Math.random should be unique because of its seeding algorithm.
		// Convert it to base 36 (numbers + letters), and grab the first 9 characters
		// after the decimal.
		return '_' + Math.random().toString(36).substr(2, 9);
	}
	private static S4() {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	}

	public static guid() {
		let S4 = Helper.S4;
		return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
	}

	public static def(obj: Object, key: string, val: any, enumerable?: boolean) {
		Object.defineProperty(obj, key, {
			value: val,
			enumerable: !!enumerable,
			writable: true,
			configurable: true
		})
	}
	public static isObject(obj: any): boolean {
		return typeof obj === 'object';
	}

	public static isFunction(foo: any): boolean {
		return typeof foo === 'function';
	}

	public static arrayMethods(arrKey: string, changeCb: any): any[] {
		let arrayProto = Array.prototype;
		let arrayMethods = Object.create(arrayProto);
		const methods = 'push|pop|shift|unshift|splice|sort|reverse'.split('|');
		methods.forEach((method) => {
			Helper.def(arrayMethods, method, function() {
				let len = arguments.length;
				let original = arrayProto[method];
				let args = new Array(len);
				while (len--) {
					args[len] = arguments[len];
				}
				let result = original.apply(this, args);

				changeCb(this, arrKey, method);
				return result;
			});
		});
		return arrayMethods;
	}
}

