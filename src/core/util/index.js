"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(require("./events"));
var Helper = (function () {
    function Helper() {
    }
    Helper.Id = function () {
        // Math.random should be unique because of its seeding algorithm.
        // Convert it to base 36 (numbers + letters), and grab the first 9 characters
        // after the decimal.
        return '_' + Math.random().toString(36).substr(2, 9);
    };
    Helper.S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    Helper.guid = function () {
        var S4 = Helper.S4;
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    };
    Helper.def = function (obj, key, val, enumerable) {
        Object.defineProperty(obj, key, {
            value: val,
            enumerable: !!enumerable,
            writable: true,
            configurable: true
        });
    };
    Helper.isObject = function (obj) {
        return typeof obj === 'object';
    };
    Helper.isFunction = function (foo) {
        return typeof foo === 'function';
    };
    Helper.arrayMethods = function (arrKey, changeCb) {
        var arrayProto = Array.prototype;
        var arrayMethods = Object.create(arrayProto);
        var methods = 'push|pop|shift|unshift|splice|sort|reverse'.split('|');
        methods.forEach(function (method) {
            Helper.def(arrayMethods, method, function () {
                var len = arguments.length;
                var original = arrayProto[method];
                var args = new Array(len);
                while (len--) {
                    args[len] = arguments[len];
                }
                var result = original.apply(this, args);
                changeCb(this, arrKey, method);
                return result;
            });
        });
        return arrayMethods;
    };
    return Helper;
}());
exports.Helper = Helper;
