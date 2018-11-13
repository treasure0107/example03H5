/**
 * Created by CC on 2018/9/26.
 */
import axios from '@/axios/index'

// get传值params，post传值data
// 首页请求
export const getIndexData = (option) => {
  return new Promise((resolve, reject) => {
    const http = axios({
      method: 'get',
      url: 'HomeApi/GetBanners',
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
//查询盘口订单 api/OtcEntrustApi/Query
export const getEntrustQuery = (option) => {
  return new Promise((resolve, reject) => {
    const http = axios({
      method: 'post',
      url: 'OtcEntrustApi/Query',
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

//发布买卖单   POST /api/OtcEntrustApi/PublishEntrust
export const PublishEntrust = (option) => {
  return new Promise((resolve, reject) => {
    const http = axios({
      method: 'post',
      url: 'OtcEntrustApi/PublishEntrust',
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
//  获取可用货币市场类型  GET /api/OtcEntrustApi/GetCoinLst
export const GetCoinList = (option) => {
  return new Promise((resolve, reject) => {
    const http = axios({
      method: 'get',
      url: 'OtcEntrustApi/GetCoinLst',
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
//获取可用支付方式   /api/OtcUser/GetEnablePayment
export const GetEnablePayment = (option) => {
  return new Promise((resolve, reject) => {
    const http = axios({
      method: 'get',
      url: 'OtcUser/GetEnablePayment',
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
//成交买卖单 POST /api/OtcEntrustApi/ApplyEntrust
export const ApplyEntrust = (option) => {
  return new Promise((resolve, reject) => {
    const http = axios({
      method: 'post',
      url: 'OtcEntrustApi/ApplyEntrust',
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

//查询自己的订单 POST /api/OtcUser/QueryOrder  QueryOrderMobil
export const QueryOrder = (option) => {
  return new Promise((resolve, reject) => {
    const http = axios({
      method: 'post',
      url: 'OtcUser/QueryOrderMobil',
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
//通过订单ID获取订单信息 GET /api/OtcOrderApi/QueryOrderInfoById
export const QueryOrderInfoById = (option) => {
  return new Promise((resolve, reject) => {
    const http = axios({
      method: 'get',
      url: 'OtcOrderApi/QueryOrderInfoById',
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
//获取用户支付方式 GET /api/OtcUser/GetPayment
export const GetPayment = (option) => {
  return new Promise((resolve, reject) => {
    const http = axios({
      method: 'get',
      url: 'OtcUser/GetPayment',
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
//添加用户支付方式 POST /api/OtcUser/AddPaymentMethod
export const AddPaymentMethod = (option) => {
  return new Promise((resolve, reject) => {
    const http = axios({
      method: 'post',
      url: 'OtcUser/AddPaymentMethod',
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
//提交申诉信息 POST /api/OtcOrderApi/AddIussueINfo
export const AddIussueINfo = (option) => {
  return new Promise((resolve, reject) => {
    const http = axios({
      method: 'post',
      url: 'OtcOrderApi/AddIussueINfo',
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
// 上传文件 POST /api/ToolkitApi/Upload
export const Upload = (option) => {
  return new Promise((resolve, reject) => {
    const http = axios({
      method: 'post',
      url: 'ToolkitApi/Upload',
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
//修改订单状态 POST /api/OtcOrderApi/UpdateOrderStatus
export const UpdateOrderStatus = (option) => {
  return new Promise((resolve, reject) => {
    const http = axios({
      method: 'post',
      url: 'OtcOrderApi/UpdateOrderStatus',
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

//获取指定商家用户基本信息 GET /api/OtcMerchantApi/GetMetchantInfo
export const GetMetchantInfo = (option) => {
  return new Promise((resolve, reject) => {
    const http = axios({
      method: 'get',
      url: 'OtcMerchantApi/GetMetchantInfo',
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
// 移除用户支付方式 POST /api/OtcUser/RemovePayment
export const RemovePayment = (option) => {
  return new Promise((resolve, reject) => {
    const http = axios({
      method: 'post',
      url: 'OtcUser/RemovePayment',
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

// 加入黑名单 GET /api/OtcBlackListApi/BlockMerchant
export const BlockMerchant = (option) => {
  return new Promise((resolve, reject) => {
    const http = axios({
      method: 'get',
      url: 'OtcBlackListApi/BlockMerchant',
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
//获取用户资产记录 POST /api/OtcUser/GetUserAssetList
export const GetUserAssetList = (option) => {
  return new Promise((resolve, reject) => {
    const http = axios({
      method: 'post',
      url: 'OtcUser/GetUserAssetList',
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
//获取法币账号用户信息 GET /api/UserApi/GetUserInfo
export const GetUserInfo = (option) => {
  return new Promise((resolve, reject) => {
    const http = axios({
      method: 'get',
      url: 'UserApi/GetUserInfo',
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
// 获取当前商户的在线状态   /api/OtcUser/GetOnlineStatus
export const GetOnlineStatus = (option) => {
  return new Promise((resolve, reject) => {
    const http = axios({
      method: 'post',
      url: 'OtcUser/GetOnlineStatus',
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
// 设置商户在线状态    /api/OtcUser/SetOnlineStatus
export const SetOnlineStatus = (option) => {
  return new Promise((resolve, reject) => {
    const http = axios({
      method: 'post',
      url: 'OtcUser/SetOnlineStatus',
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
// 查询自己的发布订单 POST /api/OtcMerchantApi/QueryEntrust
export const QueryEntrust = (option) => {
  return new Promise((resolve, reject) => {
    const http = axios({
      method: 'post',
      url: 'OtcMerchantApi/QueryEntrust',
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
//通过买卖单ID获取信息   GET /api/OtcEntrustApi/QueryById
export const QueryById = (option) => {
  return new Promise((resolve, reject) => {
    const http = axios({
      method: 'get',
      url: 'OtcEntrustApi/QueryById',
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
//根据买卖单搜索成交单   POST /api/OtcOrderApi/Query
export const OtcOrderQuery = (option) => {
  return new Promise((resolve, reject) => {
    const http = axios({
      method: 'post',
      url: 'OtcOrderApi/Query',
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
//买卖单 撤销或下架   POST /api/OtcEntrustApi/DoCancel
export const DoCancel = (option) => {
  return new Promise((resolve, reject) => {
    const http = axios({
      method: 'post',
      url: 'OtcEntrustApi/DoCancel',
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
//买卖单重新上架   POST /api/OtcEntrustApi/DoShelf
export const DoShelf = (option) => {
  return new Promise((resolve, reject) => {
    const http = axios({
      method: 'post',
      url: 'OtcEntrustApi/DoShelf',
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
//获取可用货币市场类型   GET /api/OtcEntrustApi/GetCoinLst
export const GetCoinLst = (option) => {
  return new Promise((resolve, reject) => {
    const http = axios({
      method: 'get',
      url: 'OtcEntrustApi/GetCoinLst',
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
//设置或更新用户的昵称
export const UpdateUserInfo = (option) => {
  return new Promise((resolve, reject) => {
    const http = axios({
      method: 'post',
      url: 'OtcUser/UpdateUserInfo',
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
//获取用户资产 GET /api/OtcUser/GetUserAsset
export const GetUserAsset = (option) => {
  return new Promise((resolve, reject) => {
    const http = axios({
      method: 'get',
      url: 'OtcUser/GetUserAsset',
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
//资金划转 POST /api/OtcUser/Transfer
export const Transfer = (option) => {
  return new Promise((resolve, reject) => {
    const http = axios({
      method: 'post',
      url: 'OtcUser/Transfer',
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
//黑名单列表
export const getBlackList = (option) => {
  return new Promise((resolve, reject) => {
    const http = axios({
      method: 'get',
      url: 'OtcBlackListApi/GetBlackList',
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
//移除黑名单 GET /api/OtcBlackListApi/RelaseMerchant
export const relaseMerchant = (option) => {
  return new Promise((resolve, reject) => {
    const http = axios({
      method: 'get',
      url: 'OtcBlackListApi/RelaseMerchant',
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
