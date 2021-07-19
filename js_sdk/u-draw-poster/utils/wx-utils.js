/*
 * @Author: Mr.Mao
 * @LastEditors: Mr.Mao
 * @Date: 2020-10-12 08:49:27
 * @LastEditTime: 2020-12-09 13:54:10
 * @Description:
 * @Any fool can write code that the computer can understand, and only good programmers can write code that people can understand
 */
import uni from "./global";
import {isBaseUrl, isNetworkUrl, isTmpUrl} from'./utils';
// Download the picture at the specified address, if it does not meet the download picture, return directly
export const downloadImgUrl = (url) => {
    const isLocalFile = isBaseUrl(url) || isTmpUrl(url) || !isNetworkUrl(url);
    return new Promise((resolve, reject) => {
        if (isLocalFile) {
            return resolve(url);
        }
        uni.downloadFile({
            url,
            success: (res) => resolve(res.tempFilePath),
            fail: reject
        });
    });
};
// Get the current specified node node
export const getCanvas2dContext = (selector, componentThis) => {
    return new Promise(resolve => {
        const query = (componentThis?
            uni.createSelectorQuery().in(componentThis):
            uni.createSelectorQuery());
        query.select(selector)
            .fields({ node: true }, res => {
            const node = res === null || res === void 0? void 0: res.node;
            resolve(node || {});
        }).exec();
    });
};
