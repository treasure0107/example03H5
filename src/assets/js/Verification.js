import { Toast } from 'mint-ui';
export default {
  handleData(data) {
    if (data.Status) {
      return true
    } else {
      Toast({
        message: data.Msg,
        position: "top",
        duration: 2000
      });
      if (data.ErrorCode == 'NeedAuth') {
        localStorage.removeItem("token");
        localStorage.removeItem("UserInfo");
      }
      return false
    }
  },
  setChange(val, unit) {
    if (val.length == 2) {
      if (val[0] == 0 && val[1] != ".") {
        val = val[1];
      }
    }
    let reg = /^[1-9]\d*(\.\d*)?|^0(\.\d*)?/g;
    val = val + "";
    let result = val.match(reg);
    const unitNum = Number(unit);
    result = result ? result[0] : "";
    if (result.indexOf(".") != -1 && result.split(".")[1].length > unitNum) {
      result =
        parseInt(Number(result) * Math.pow(10, unitNum)) /
        Math.pow(10, unitNum);
    }
    return result;
  },
  //邮箱
  isEmail(str) {
    if (str.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) != -1) return true;
    else return false;
  },
  //手机号码
  isPhoneNum(str) {
    if (!str) return;
    let reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    return reg.test(str);
  },
  //包含字母
  hasLetter(str) {
    var regExp = new RegExp("[a-zA-Z]");
    return regExp.test(str);
  },
  //包含特殊字符
  hasOther(str) {
    var regExp = new RegExp("[`~!@#$%^&*()=|{}':;',\\[\\].<>/?~！@#￥……％&*（）——|{}【】‘；：”“'。，、？]");
    return regExp.test(str);
  },
  //包含中文
  hasChinese(str) {
    var regExp = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
    return regExp.test(str);
  },
  //身份证
  isCardID(str) {
    if (!str) return;
    let reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    return reg.test(str);
  },
  distinctArray(data) {
    if (data.length > 0) {
      return Array.from(new Set(data));
    }
  },
  fixNumber(value, unit) {
    var value = isNaN(value) ? "0" : parseFloat(value).toFixed(8);
    var unit = unit || 0;
    let isInt = value.indexOf(".") == -1 ? true : false;
    let intNum = value.split(".")[0];
    let floatNum = !isInt ? value.split(".")[1] : "0";
    let floatArry = floatNum.split("");
    let newFloatNum = ".";
    for (let i = 0; i < unit; i++) {
      if (!floatArry[i]) {
        newFloatNum += "0"
      } else {
        newFloatNum += floatArry[i]
      }
    }
    return parseFloat(intNum + newFloatNum).toFixed(unit)
  },
  //密码强度验证
  pwdStrong(pwd) {
    if (!pwd) return;
    this.number = 1;
    let regNumber = /[\d]/,
      regTxt = /[a-zA-Z]/;
    let regCn = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
    /*   regBigTxt = /[A-Z]/;*/
    if (pwd.length >= 6 && pwd.length <= 20) {
      if (regNumber.test(pwd)) {
        this.number++;
      }
      if (regTxt.test(pwd)) {
        this.number++;
      }
      if (regCn.test(pwd)) {
        this.number++;
      }
    }
    return this.number;
  },
  regEmail(email) {
    if (String(email).indexOf("@") > 0) {
      var str = email.split("@"),
        _s = "";
      if (str[0].length > 3) {
        for (var i = 0; i < str[0].length - 3; i++) {
          _s += "*";
        }
      }
      var new_email = str[0].substr(0, 3) + _s + "@" + str[1];
    }
    return new_email;
  },
  regMobile(mobile) {
    if (mobile.length > 7) {
      var new_mobile = mobile.substr(0, 3) + "****" + mobile.substr(7);
    }
    return new_mobile;
  },
  //获取国家列表
  // getCountryList(callback){
  //   try {
  //     axios({
  //       method: "get",
  //       url: "./static/country.json",
  //       data: {}
  //     }).then((result) => {
  //       let data = this.distinctArray(result.data);
  //       if (data.length > 0) {
  //         if (callback) {
  //           callback(data);
  //         }
  //       }
  //     });
  //   } catch (ex) {
  //     this.consoleLog(ex);
  //   }
  // },
  //浮点数乘法
  mul(arg1, arg2) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
      m += s1.split(".")[1].length;
    }
    catch (e) {
    }
    try {
      m += s2.split(".")[1].length;
    }
    catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
  }
}
