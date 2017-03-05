export const Watcher = (modelPath: string, options?: Object) => {
	return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {

		target['$__WATCHERS__'] = target['$__WATCHERS__'] || [];
		target['$__WATCHER_CALLBACKS__'] = target['$__WATCHER_CALLBACKS__'] || {};

		if (descriptor === undefined) {
			descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
		}
		// var originalMethod = descriptor.value;

		target['$__WATCHER_CALLBACKS__'][modelPath] = propertyKey;
		target['$__WATCHERS__'].push(modelPath);
		



		// descriptor.value = function() {
			// var args = [];
			// for (var _i = 0; _i < arguments.length; _i++) {
			// 	args[_i - 0] = arguments[_i];
			// }
			// var a = args.map(function(a) { return JSON.stringify(a); }).join();
			// // note usage of originalMethod here
			// var result = originalMethod.apply(this, args);
			// var r = JSON.stringify(result);
			// console.log(modelPath + "Call: " + propertyKey + "(" + a + ") => " + r);
			// return result;
		// };

		return descriptor;

	}
}