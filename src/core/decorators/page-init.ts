import { WxDecorators } from '../wx-page';

export let WxPage = (target: any) => Page(new WxDecorators.WxPage(target).WrappedPageInstance);
