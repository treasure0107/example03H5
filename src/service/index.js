import axios from '@/axios/index'

// get传值params，post传值data

// 滚动新闻公告
export const getNewsList = (option) => {
    return new Promise((resolve, reject) => {
        const http = axios({
            method: 'get',
            url: 'DocApi/GetNewsList',
            params:option
        });

        http.then(response => {
            resolve(response);
        });

        http.catch(reason => {
            reject(reason);
        });
    })
};

// banner
export const getBanners = (option) => {
    return new Promise((resolve, reject) => {
        const http = axios({
            method: 'get',
            url: 'HomeApi/GetBanners?ismobile=true',
            params:option
        });

        http.then(response => {
            resolve(response);
        });

        http.catch(reason => {
            reject(reason);
        });
    })
};

// 新闻详情
export const getNewsDetail = (id) => {
    return new Promise((resolve, reject) => {
        const http = axios({
            method: 'get',
            url: 'DocApi/GetArticleById/'+ id,
        });

        http.then(response => {
            resolve(response);
        });

        http.catch(reason => {
            reject(reason);
        });
    })
};

// 费率
export const getRate = () => {
    return new Promise((resolve, reject) => {
        const http = axios({
            method: 'get',
            url: 'MarketApi/GetCurrencyList'
        });

        http.then(response => {
            resolve(response);
        });

        http.catch(reason => {
            reject(reason);
        });
    })
};

// 获取资产
export const getUserAssetList = () => {
    return new Promise((resolve, reject) => {
        const http = axios({
            method: 'get',
            url: 'OtcUser/GetUserAsset'
        });

        http.then(response => {
            resolve(response);
        });

        http.catch(reason => {
            reject(reason);
        });
    })
};