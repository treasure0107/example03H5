import axios from '@/axios/index'

// 获取用户信息
export const getUserMsg = () => {
    return new Promise((resolve, reject) => {
        const http = axios({
            method: 'get',
            url: 'UserApi/GetUserInfo?Authorization=bearer '+ localStorage.getItem("token")
        });

        http.then(response => {
            resolve(response);
        });

        http.catch(reason => {
            reject(reason);
        });
    })
};

// 获取用户协议
export const getAgreement = () => {
    return new Promise((resolve, reject) => {
        const http = axios({
            method: 'get',
            url: 'DocApi/GetDocModelById?docId=3'
        });

        http.then(response => {
            resolve(response);
        });

        http.catch(reason => {
            reject(reason);
        });
    })
};

// 获取图形验证码
export const getImgCode = (option) => {
    return new Promise((resolve, reject) => {
        const http = axios({
            method: 'get',
            url: 'ToolkitApi/GetImageCode',
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

// 获取信息验证码
export const getMessageCode = (option) => {
    return new Promise((resolve, reject) => {
        const http = axios({
            method: 'post',
            url: 'ToolkitApi/SendMsgCode',
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

// 登录
export const login = (option) => {
    return new Promise((resolve, reject) => {
        const http = axios({
            method: 'post',
            url: 'UserApi/DoLogin',
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

// 注册
export const DoSignup = (option) => {
    return new Promise((resolve, reject) => {
        const http = axios({
            method: 'post',
            url: 'UserApi/DoSignup',
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

// 忘记密码
export const DoForgotLoginPwd = (option) => {
    return new Promise((resolve, reject) => {
        const http = axios({
            method: 'post',
            url: 'UserApi/DoForgotLoginPwd',
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

// 绑定手机邮箱
export const DoAuthAccount = (option) => {
    return new Promise((resolve, reject) => {
        const http = axios({
            method: 'post',
            url: 'SafeApi/DoAuthAccount',
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

// 修改登录密码
export const DoAuthLoginPwd = (option) => {
    return new Promise((resolve, reject) => {
        const http = axios({
            method: 'post',
            url: 'SafeApi/DoAuthLoginPwd',
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

// 修改资金密码
export const DoAuthSafePwdModify = (option) => {
    return new Promise((resolve, reject) => {
        const http = axios({
            method: 'post',
            url: 'SafeApi/DoAuthSafePwdModify',
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

// 设置资金密码
export const DoAuthSafePwd = (option) => {
    return new Promise((resolve, reject) => {
        const http = axios({
            method: 'post',
            url: 'SafeApi/DoAuthSafePwd',
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

// 忘记资金密码
export const DoForgotSafePwd = (option) => {
    return new Promise((resolve, reject) => {
        const http = axios({
            method: 'post',
            url: 'UserApi/DoForgotSafePwd',
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

// 获取登录策略
export const GetLoginStrategy = (option) => {
    return new Promise((resolve, reject) => {
        const http = axios({
            method: 'get',
            url: 'UserApi/GetLoginStrategy',
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