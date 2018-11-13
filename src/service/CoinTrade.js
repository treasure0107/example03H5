import axios from '@/axios/index'

// get传值params，post传值data
// 可用金额请求
export const getCoinTradeData = (option) => {
    return new Promise((resolve, reject) => {
        const http = axios({
            method: 'get',
            url: 'AssetApi/GetUserAssetByceId',
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
// 安全策略请求
export const GetTradeStrategy = (option) => {
    return new Promise((resolve, reject) => {
        const http = axios({
            method: 'get',
            url: 'SafeApi/GetTradeStrategy',
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
// 委托买入
export const DoEntrust = (option) => {
    return new Promise((resolve, reject) => {
        const http = axios({
            method: 'post',
            url: 'TradeApi/DoEntrust',
            data:option
        });

        http.then(response => {
            resolve(response);
        });

        http.catch(reason => {
            reject(reason);
        });
    })
};
// 委托记录
export const GetEntrustRecentList = (option) => {
    return new Promise((resolve, reject) => {
        const http = axios({
            method: 'get',
            url: 'TradeApi/GetEntrustRecentList',
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
// 委托记录
export const GetPageOrderListByEntrustId = (option) => {
    return new Promise((resolve, reject) => {
        const http = axios({
            method: 'get',
            url: 'TradeApi/GetPageOrderListByEntrustId',
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
// 取消委托
export const DoCancelEntrust = (option) => {
    return new Promise((resolve, reject) => {
        const http = axios({
            method: 'post',
            url: 'TradeApi/DoCancelEntrust',
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
// 获取用户资产信息
export const GetUserAssetList = (option) => {
    return new Promise((resolve, reject) => {
        const http = axios({
            method: 'get',
            url: '/AssetApi/GetUserAssetList',
          data:option
        });

        http.then(response => {
            resolve(response);
        });

        http.catch(reason => {
            reject(reason);
        });
    })
};
// 获
export const GetEntrustList = (option) => {
    return new Promise((resolve, reject) => {
        const http = axios({
            method: 'post',
            url: 'TradeApi/GetEntrustList',
          data:option
        });

        http.then(response => {
            resolve(response);
        });

        http.catch(reason => {
            reject(reason);
        });
    })
};
// 充值列表
export const GetUserDepositList = (option) => {
    return new Promise((resolve, reject) => {
        const http = axios({
            method: 'get',
            url: 'AssetApi/GetUserDepositList',
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
// 获取用户提现地址列表信息
export const GetUserWithdrawAccountList = (option) => {
    return new Promise((resolve, reject) => {
        const http = axios({
            method: 'get',
            url: 'AssetApi/GetUserWithdrawAccountList',
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
// 提现
export const DoWithdraw = (option) => {
    return new Promise((resolve, reject) => {
        const http = axios({
            method: 'post',
            url: 'AssetApi/DoWithdraw',
          data:option
        });

        http.then(response => {
            resolve(response);
        });

        http.catch(reason => {
            reject(reason);
        });
    })
};
// add提现地址
export const DoAddUserWithdrawAccount = (option) => {
    return new Promise((resolve, reject) => {
        const http = axios({
            method: 'post',
            url: '/AssetApi/DoAddUserWithdrawAccount',
          data:option
        });

        http.then(response => {
            resolve(response);
        });

        http.catch(reason => {
            reject(reason);
        });
    })
};
// 提现列表
export const GetUserWithdrawList = (option) => {
    return new Promise((resolve, reject) => {
        const http = axios({
            method: 'get',
            url: 'AssetApi/GetUserWithdrawList',
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
// 检查账户
export const CheckAccount = (option) => {
    return new Promise((resolve, reject) => {
        const http = axios({
            method: 'get',
            url: 'UserApi/CheckAccount',
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
// 检查账户
export const DoMutualTransfer = (option) => {
    return new Promise((resolve, reject) => {
        const http = axios({
            method: 'post',
            url: 'AssetApi/DoMutualTransfer',
          data:option
        });

        http.then(response => {
            resolve(response);
        });

        http.catch(reason => {
            reject(reason);
        });
    })
};
// 划转列表
export const QueryTransferAsset = (option) => {
    return new Promise((resolve, reject) => {
        const http = axios({
            method: 'post',
            url: 'AssetApi/QueryTransferAsset',
          data:option
        });

        http.then(response => {
            resolve(response);
        });

        http.catch(reason => {
            reject(reason);
        });
    })
};
// 划转列表
export const DoDeleteUserWithdrawAccount = (option) => {
    return new Promise((resolve, reject) => {
        const http = axios({
            method: 'post',
            url: 'AssetApi/DoDeleteUserWithdrawAccount/' + option,
        });

        http.then(response => {
            resolve(response);
        });

        http.catch(reason => {
            reject(reason);
        });
    })
};
// 财务记录列表
export const GetUserAssetRecordList = (option) => {
    return new Promise((resolve, reject) => {
        const http = axios({
            method: 'post',
            url: 'AssetApi/GetUserAssetRecordList',
          data: option
        });

        http.then(response => {
            resolve(response);
        });

        http.catch(reason => {
            reject(reason);
        });
    })
};
// 提现安全策略
export const GetWithDrawStrategy = (option) => {
    return new Promise((resolve, reject) => {
        const http = axios({
            method: 'get',
            url: 'SafeApi/GetWithDrawStrategy',
          params: option
        });

        http.then(response => {
            resolve(response);
        });

        http.catch(reason => {
            reject(reason);
        });
    })
};
// 提现安全策略
export const QueryNickName = (option) => {
    return new Promise((resolve, reject) => {
        const http = axios({
            method: 'get',
            url: 'UserApi/QueryNickName',
          params: option
        });

        http.then(response => {
            resolve(response);
        });

        http.catch(reason => {
            reject(reason);
        });
    })
};
// 提现安全策略
export const TransferToGfc = (option) => {
    return new Promise((resolve, reject) => {
        const http = axios({
            method: 'post',
            url: 'AssetApi/TransferToGfc',
          data: option
        });

        http.then(response => {
            resolve(response);
        });

        http.catch(reason => {
            reject(reason);
        });
    })
};
