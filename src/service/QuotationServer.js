import axios from '@/axios/index'

// get传值params，post传值data

// 获取交易对
export const getCoinlist = (option) => {
    return new Promise((resolve, reject) => {
        const http = axios({
            method: 'get',
            url: 'MarketApi/GetExchangeMarketList',
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

// 获取交易市场
export const getCoinMarket = (option) => {
    return new Promise((resolve, reject) => {
        const http = axios({
            method: 'get',
            url: 'MarketApi/GetExchangeMarketList',
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

// 获取所有的市场类型
export const getMarketTypeList = (option) => {
    return new Promise((resolve, reject) => {
        const http = axios({
            method: 'get',
            url: 'MarketApi/GetMarketTypeList',
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

// 获取币种资料
export const getCoinIntroduction = (option) => {
    return new Promise((resolve, reject) => {
        const http = axios({
            method: 'get',
            url: 'MarketApi/GetCurrencyConfigExpand',
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