"use strict";
var EXCLUDE_PROMISE_API = [
    'clearStorage',
    'hideToast',
    'showNavigationBarLoading',
    'hideNavigationBarLoading',
    'drawCanvas',
    'canvasToTempFilePath',
    'hideKeyboard'
];
var WxApiPromise = (function () {
    function WxApiPromise() {
        this._wxApi = wx;
        this._wrappedApi = {};
        this._wrapperApi();
    }
    Object.defineProperty(WxApiPromise.prototype, "WxApi", {
        get: function () {
            return this._wrappedApi;
        },
        enumerable: true,
        configurable: true
    });
    WxApiPromise.prototype._canNotPromisable = function (apiKey) {
        return EXCLUDE_PROMISE_API.indexOf(apiKey) !== -1
            || /^(on|create|stop|pause|close)/.test(apiKey)
            || /\w+Sync$/.test(apiKey);
    };
    WxApiPromise.prototype._wrapperApi = function () {
        var _this = this;
        Object.keys(this._wxApi).forEach(function (apiKey) {
            if (_this._canNotPromisable(apiKey)) {
                _this._wrappedApi[apiKey] = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return _this._wxApi[apiKey].apply(_this._wrappedApi, args);
                };
                return;
            }
            _this._wrappedApi[apiKey] = function (object) {
                var obj = object || {};
                return new Promise(function (resolve, reject) {
                    obj.success = resolve;
                    obj.fail = function (res) {
                        if (res && res.errMsg) {
                            reject(new Error(res.errMsg));
                        }
                        else {
                            reject(res);
                        }
                    };
                    _this._wxApi[apiKey](obj);
                });
            };
        });
    };
    return WxApiPromise;
}());
exports.WxApiPromise = WxApiPromise;
