"use strict";
var wx_api_wrapper_1 = require("../wx-api-wrapper");
var index_1 = require("./index");
var apiWrapper = new wx_api_wrapper_1.WxApiPromise();
var WITH_BODY = ['post', 'put', 'patch'];
var RequestMethod;
(function (RequestMethod) {
    RequestMethod[RequestMethod["Get"] = 0] = "Get";
    RequestMethod[RequestMethod["Post"] = 1] = "Post";
    RequestMethod[RequestMethod["Put"] = 2] = "Put";
    RequestMethod[RequestMethod["Delete"] = 3] = "Delete";
    RequestMethod[RequestMethod["Options"] = 4] = "Options";
    RequestMethod[RequestMethod["Head"] = 5] = "Head";
    RequestMethod[RequestMethod["Patch"] = 6] = "Patch";
})(RequestMethod = exports.RequestMethod || (exports.RequestMethod = {}));
var WxHttpClient = (function () {
    function WxHttpClient() {
        this._wx = wx;
        this._requestHeaders = {};
    }
    WxHttpClient.prototype.setHeader = function (header, isGlobal) {
        isGlobal ? Object.assign(WxHttpClient._globalHeaders, header) : Object.assign(this._requestHeaders, header);
    };
    WxHttpClient.prototype.setGlobalHeader = function (header) {
        this.setHeader(header, true);
    };
    WxHttpClient.prototype.getHeaders = function () {
        return Object.assign({}, WxHttpClient._globalHeaders, this._requestHeaders);
    };
    WxHttpClient.prototype._removePendingRequest = function (pId) {
        var pIndex = WxHttpClient.PendingRequests.findIndex(function (p) { return p === pId; });
        WxHttpClient.PendingRequests.splice(pIndex, 1);
    };
    WxHttpClient.prototype._buildRequest = function (url, method, body, options) {
        var paramOptions = options || {};
        var opts = {};
        opts.method = method;
        opts.data = body || paramOptions.data;
        opts.header = paramOptions.header || {};
        return this.request(url, opts);
    };
    WxHttpClient.prototype._globalHandleResponse = function (pId, res) {
        if (res.statusCode == 400 || res.statusCode == 500 || res.statusCode == 401) {
            return Promise.reject(res.errMsg);
        }
        this._removePendingRequest(pId);
        var itcpt = WxHttpClient.Interceptors;
        var tempResponseResult;
        itcpt.forEach(function (interceptor) {
            tempResponseResult = interceptor.response(res);
        });
        return Promise.resolve(tempResponseResult || res);
    };
    WxHttpClient.prototype._globalHandleError = function (pId, err) {
        console.info('%c.............global catch here....................', 'color: orange');
        this._removePendingRequest(pId);
        var itcpt = WxHttpClient.Interceptors;
        var tempError;
        itcpt.forEach(function (interceptor) {
            tempError = interceptor.responseError(err);
        });
        return Promise.reject(err);
    };
    WxHttpClient.prototype._excutePromise = function (p) {
        var _this = this;
        var pId = index_1.Helper.Id();
        WxHttpClient.PendingRequests.push(pId);
        return p.then(function (res) { return _this._globalHandleResponse(pId, res); })["catch"](function (err) { return _this._globalHandleError(pId, err); });
    };
    WxHttpClient.prototype.request = function (url, options) {
        var opts = {};
        if (!url && !options.url) {
            throw new Error('Url不为空');
        }
        if (!options.method) {
            throw new Error('HttpMethod 不为空');
        }
        if (WITH_BODY.indexOf(options.method.toLowerCase()) !== -1) {
            opts.data = options.data;
        }
        this.setHeader(options.header);
        opts.header = this.getHeaders();
        opts.url = url;
        opts.method = options.method.toUpperCase();
        var tempRequestResult;
        if (WxHttpClient.Interceptors.length) {
            var itcpt = WxHttpClient.Interceptors;
            // let itcptRet: any = [];
            itcpt.forEach(function (interceptor) {
                tempRequestResult = interceptor.request(opts);
            });
        }
        var wxHttpPromise = apiWrapper.WxApi.request(tempRequestResult || opts);
        return this._excutePromise(wxHttpPromise);
    };
    WxHttpClient.prototype.get = function (url, options) {
        return this._buildRequest(url, RequestMethod[RequestMethod.Get], options);
    };
    WxHttpClient.prototype.post = function (url, body, options) {
        return this._buildRequest(url, RequestMethod[RequestMethod.Post], body, options);
    };
    WxHttpClient.prototype.put = function (url, body, options) {
        return this._buildRequest(url, RequestMethod[RequestMethod.Put], body, options);
    };
    WxHttpClient.prototype["delete"] = function (url, options) {
        return this._buildRequest(url, RequestMethod[RequestMethod.Delete], null);
    };
    WxHttpClient.prototype.patch = function (url, body, options) {
        return this._buildRequest(url, RequestMethod[RequestMethod.Patch], body, options);
    };
    return WxHttpClient;
}());
WxHttpClient.Interceptors = [];
WxHttpClient.PendingRequests = [];
WxHttpClient._globalHeaders = {
    'Content-Type': 'application/json'
};
exports.WxHttpClient = WxHttpClient;
