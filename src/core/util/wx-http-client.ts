import { WxApiPromise } from '../wx-api-wrapper';
import { Helper } from './index';
export type RequestOptionsArgs = WXNetAPIRequestObj;
export type Body = string | Object;
export type Headers = { [key: string]: string };

const apiWrapper = new WxApiPromise();
const WITH_BODY = ['post', 'put', 'patch'];

export interface Response {
    data: any;
}
export enum RequestMethod {
    Get = 0,
    Post = 1,
    Put = 2,
    Delete = 3,
    Options = 4,
    Head = 5,
    Patch = 6,
}


export interface Interceptor {
    request?: (RequestOptionsArgs) => RequestOptionsArgs;
    response?: (Response) => any;
    responseError?: (any) => any;
}

export class WxHttpClient {

    public static Interceptors: Array<Interceptor> = [];

    protected _wx = wx;

    public static PendingRequests = [];

    private static _globalHeaders: Headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    private _requestHeaders: Headers = {};

    public context: any;

    protected _defaultOptions: RequestOptionsArgs;

    public setHeader(header: Headers, isGlobal?: boolean): void {
        isGlobal ? Object.assign(WxHttpClient._globalHeaders, header) : Object.assign(this._requestHeaders, header);
    }

    public setGlobalHeader(header: Headers) {
        this.setHeader(header, true);
    }

    public getHeaders(): Headers {
        return Object.assign({}, WxHttpClient._globalHeaders, this._requestHeaders);
    }

    private _removePendingRequest(pId: string): void {
        let pIndex = WxHttpClient.PendingRequests.findIndex(p => p === pId);
        WxHttpClient.PendingRequests.splice(pIndex, 1);
    }

    private _buildRequest(url: string, method: string, body: Body, options?: RequestOptionsArgs): Promise<WxResponse> {
        let paramOptions: any = options || {};
        let opts: any = {};
        opts.method = method;
        opts.data = body || paramOptions.data;
        opts.header = paramOptions.header || {};
        
        return this.request(url, opts);
    }

    private _globalHandleResponse(pId: string, res: any) {
        if (res.statusCode == 400 || res.statusCode == 500 || res.statusCode == 401) {
            return Promise.reject(res.errMsg);
        }
        this._removePendingRequest(pId);
        let itcpt = WxHttpClient.Interceptors;
        let tempResponseResult;
        itcpt.forEach(interceptor => {
            tempResponseResult = interceptor.response(res);
        });
        return Promise.resolve(tempResponseResult || res);
    }

    private _globalHandleError(pId: string, err: any) {
        console.info('%c.............global catch here....................', 'color: orange');
        this._removePendingRequest(pId);
        let itcpt = WxHttpClient.Interceptors;
        let tempError;
        itcpt.forEach(interceptor => {
            tempError = interceptor.responseError(err);
        });
        
        return Promise.reject(err);
    }

    private _excutePromise(p: Promise<any>) {
        let pId = Helper.Id();
        WxHttpClient.PendingRequests.push(pId);

        return p.then(res => this._globalHandleResponse(pId, res)).catch(err => this._globalHandleError(pId, err));
    }

    public request(url: string, options?: RequestOptionsArgs): Promise<any> {
        let opts: any = {};
        if (!url && !options.url) {
            throw new Error('Url不为空');
        }
        if (!options.method) {
            throw new Error('HttpMethod 不为空');
        }
        if (WITH_BODY.indexOf(options.method.toLowerCase()) !== -1) {
            opts.data = options.data;
        }
        this.setHeader(<Headers>options.header);
        opts.header = this.getHeaders();
        opts.url = url;
        opts.method = options.method.toUpperCase();

        let tempRequestResult;
        if (WxHttpClient.Interceptors.length) {
            let itcpt = WxHttpClient.Interceptors;
            // let itcptRet: any = [];
            itcpt.forEach(interceptor => {
                tempRequestResult = interceptor.request(opts);
            })
        }
        let wxHttpPromise = apiWrapper.WxApi.request(tempRequestResult || opts);

        return this._excutePromise(wxHttpPromise);
    }
    public get(url: string, options?: RequestOptionsArgs): Promise<WxResponse> {
        return this._buildRequest(url, RequestMethod[RequestMethod.Get], options);
    }
    public post(url: string, body: Body, options?: RequestOptionsArgs): Promise<WxResponse> {
        return this._buildRequest(url, RequestMethod[RequestMethod.Post], body, options);
    }
    public put(url: string, body: Body, options?: RequestOptionsArgs): Promise<WxResponse> {
        return this._buildRequest(url, RequestMethod[RequestMethod.Put], body, options);
    }
    public delete(url: string, options?: RequestOptionsArgs): Promise<WxResponse> {
        return this._buildRequest(url, RequestMethod[RequestMethod.Delete], null);
    }
    public patch(url: string, body: Body, options?: RequestOptionsArgs): Promise<WxResponse> {
        return this._buildRequest(url, RequestMethod[RequestMethod.Patch], body, options);
    }
}
