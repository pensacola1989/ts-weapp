import { Helper } from '../core/util/index';

export interface IPage {

    /**
     * [read-only]页面的初始数据
     */
    data?: any;

    /**
     * 生命周期函数--监听页面加载
     */
    // onLoad?: () => void;
    onLoad?(): void;
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady?(): void;

    /**
     * 生命周期函数--监听页面显示
     */
    onShow?(): void;

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide?: () => void;

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload?: () => void;

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh?: () => void;

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom?: () => void;


    /**
     * 强制更新
     */
    forceUpdate?: () => void;

    /**
     * 更新
     */
    update?: () => void;
}




export abstract class PageBase implements IPage {

    __PAGE__: PageBase;
    /**
     * 将数据从逻辑层发送到视图层，同时改变对应的 this.data 的值
     */
    protected setData?: (data: any) => void;

    protected $set(obj: Object | Array<any>, key: number | string, val: any) {
        // 不能对根级对象使用此方法
        if (!obj['__DEP_OBJ_PATH__']) {
            return false;
        }
        if (Array.isArray(obj)) {
            if (obj[key]) {
                obj.splice(<number>key, 1, val);
            }
        }
        else if (obj instanceof Object) {
            obj[key] = val;
        }
    }
}
