<template>
  <div class="container">
    <div class="headCon">
      <span class="goBack" @click="goBack"></span>
    </div>
    <section class="main">
      <div class="m-tit">添加银行卡</div>
      <div class="con">
        <div class="con-i"><label>姓名</label><input style="color:#50565c;" disabled type="text" placeholder="请输入姓名"
                                                   v-model="TrueName"></div>
        <div class="con-i"><label>开户银行</label><input type="text" placeholder="请输入开户银行" v-model="BankName"></div>
        <div class="con-i"><label>银行卡号</label><input type="number" placeholder="请输入银行卡号" v-model="BankCard"></div>
        <div class="con-i"><label>开户支行</label><input type="text" placeholder="请输入开户银行" v-model="BankAddress"></div>
        <div class="con-i"><label>备注</label><input type="text" placeholder="请设置备注名称" v-model="Remark"></div>
      </div>

      <div>
        <mt-button type="primary" size="large" class="btn" @click="save">保存</mt-button>
      </div>
    </section>

    <!--弹窗-->
    <mt-popup
      v-model="popupVisible"
      position="bottom"
      class="popupVisible">
      <div>
        <div class="popup-tit">
          <span class="pop-tit">请输入资金密码</span> <span class="cancel" @click="popupVisible = false;">取消</span>
        </div>
        <div class="moneyPassword">
          <input type="password" placeholder="请输入资金密码" class="password" v-model="safePwd">
        </div>
        <div class="popBtn">
          <router-link to="/ForgetSafe" class="forgetPassword">忘记密码？</router-link>
          <mt-button class="sureBtn" type="primary" size="large" @click="sure()">确定</mt-button>
        </div>
      </div>
    </mt-popup>
    <mt-popup
      v-model="popupVisibleIcon"
      class="popupVisibleQuery">
      <div class="popup-tit">提示</div>
      <div class="popup-con">请您先在PC端进行实名认证才能添加银行卡</div>
      <div class="popBtn" @click="popupVisibleIcon=false;">知道了</div>
    </mt-popup>
  </div>
</template>
<script type="text/babel">
  import {AddPaymentMethod, GetUserInfo} from "@/service/CurrencytTrade";
  import countDown from '@/components/countDown';
  import {createNamespacedHelpers} from "vuex";
  import Verification from "@/assets/js/Verification";
  const {mapState, mapMutations} = createNamespacedHelpers("pairs");
  import {InfiniteScroll, Popup, Toast} from 'mint-ui';
  export default {
    data(){
      return {
        popupVisible: false,   //资金密码弹窗
        popupVisibleIcon: false,   //提示
        PaymentType: "Bank",
        BankAddress: "",   //开户支行
        BankCard: "",   //银行卡号
        BankName: "",   //开户银行
        Remark: "",   //备注
        TrueName: "",   //姓名
        safePwd: "",   //资金密码
        UserInfo: {}   //用户详情
      }

    },
    i18n: {
      messages: {
        "zh-CN": {
          lang: "中文",

        },
        "en-US": {
          lang: "English",
        }
      }
    },
    mounted(){
      this.getUserInfo();
    },
    methods: {
      ...mapMutations([
        'setTheme'
      ]),
      getUserInfo() {   //获取用户详情
        let option = {}; // 参数
        const res = GetUserInfo(option); // 调用请求传参
        res.then(data => {   // 成功
          this.UserInfo = data.Data;
//          console.log(this.UserInfo);
          this.TrueName = this.UserInfo.FullName;
        });
        res.catch(err => {  // 失败
          console.log(err);
        });
      },
      save(){   //点击保存，资金密码弹窗显示（条件判断）
        let pattern = /^\d{16,19}$/;
        if (!pattern.test(this.BankCard)) {
          this.$toast({
            message: "请输入16-19位銀行卡号！",
            position: 'top',
            duration: 1000
          });
          return false;
        }
        if (!this.BankCard ) {
          this.$toast({
            message: "银行卡号不能为空！",
            position: 'top',
            duration: 1000
          });
          return false;
        }
        if (!this.BankName ) {
          this.$toast({
            message: "开户银行名称不能为空！",
            position: 'top',
            duration: 1000
          });
          return false;
        }
        this.popupVisible = true;
      },
      sure() {   //添加银行卡
        this.popupVisible = false;
        if (!this.safePwd) {
          this.$toast({
            message: "资金密码不能为空！",
            duration: 1000
          });
          return false;
        }
        let option = {
          BankAddress: this.BankAddress,
          BankCard: this.BankCard,
          BankName: this.BankName,
          PaymentType: this.PaymentType,
          Remark: this.Remark,
          TrueName: this.TrueName,
          safePwd: this.safePwd
        }; // 参数
        const res = AddPaymentMethod(option); // 调用请求传参
        res.then(data => {
          this.safePwd = '';
          // 成功
          if (Verification.handleData(data)) {
            this.$router.push('/receivingSet');
          }
        });
        res.catch(err => {
          // 失败
          this.safePwd = '';
          console.log(err);
        });
      },
      goBack(){
        this.$router.back();
      },
      setDefaultLanguage() {
        const cookieLanguage = this.$_cookie.get("language");
        if (cookieLanguage) {
          this.setLanguage(cookieLanguage);
        } else {
          this.setLanguage("zh-CN");
        }
      },
      // 设置语言
      setLanguage(language) {
        switch (language) {
          case "zh-CN":
            this.$i18n.locale = "zh-CN";
            this.$_cookie.set("language", "zh-CN");
            break;
          case "en-US":
            this.$i18n.locale = "en-US";
            this.$_cookie.set("language", "en-US");
            break;
          default:
            break;
        }
      },
      set (themeName) {
        this.setTheme(themeName);
        localStorage.setItem('theme', themeName)
      }
    },
    computed: {
      ...mapState([
        'theme',
      ])
    },
    components: {}
  }

</script>

<style lang="scss" scoped>
  @import '~@/design/scoped';

  .headCon {
    height: 88px;
    line-height: 88px;
    position: relative;
    text-align: center;
    font-size: 34px;
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    color: rgba(14, 48, 76, 1);
    box-shadow: 0px 6px 12px 0px rgba(197, 210, 229, 0.27);
    background-color: #fff;
    .goBack {
      position: absolute;
      top: 28px;
      left: 30px;
      width: 30px;
      height: 30px;
      @include bg-icon('goBack.png', 30px);
    }
  }

  .popupVisible {
    width: 100%;
    height: 450px;
    input {
      border: none;
      outline: none;
      background: none;
    }
    .popup-tit {
      border-bottom: 2px solid #CFD6DB;
      padding: 30px 30px 26px;
      .pop-tit {
        font-size: 32px;
        font-family: PingFang-SC-Heavy;
        font-weight: 600;
        color: #0E304C;
      }
      .cancel {
        font-size: 26px;
        font-family: PingFang-SC-Medium;
        font-weight: 500;
        color: #ADB7C1;
        float: right;
      }
    }
    .moneyPassword {
      font-size: 26px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(173, 183, 193, 1);
      margin-top: 60px;
      margin-left: 30px;
      margin-right: 30px;
      border-bottom: 2px solid #CFD6DB;
      .password {
        font-size: 26px;
        padding: 16px;
        width: 100%;
      }
    }
    .forgetPassword {
      font-size: 24px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(50, 145, 235, 1);
    }
    .popBtn {
      margin: 30px;
      text-align: right;
      .sureBtn {
        margin-top: 46px;
        height: 80px;
        font-size: 30px;
        font-family: PingFang-SC-Bold;
        letter-spacing: 10px;
        background-color: #3291EB;

      }
    }
  }

  .popupVisibleQuery {
    width: 600px;
    .popup-tit {
      font-size: 34px;
      font-family: PingFang-SC-Heavy;
      font-weight: 600;
      color: rgba(14, 48, 76, 1);
      text-align: center;
      padding: 43px 0;
    }
    .popup-con {
      font-size: 28px;
      font-family: PingFang-SC-Medium;
      color: rgba(14, 48, 76, 1);
      text-align: center;
      padding-bottom: 43px;
      border-bottom: 1px solid #CFD6DB;
    }
    .popBtn {
      height: 100px;
      line-height: 100px;
      text-align: center;
      font-size: 34px;
      font-family: PingFang-SC-Medium;
      color: #3291EB;
    }
  }

  .main {
    padding: 30px;
    .m-tit {
      font-size: 50px;
      font-family: PingFang-SC-Bold;
      font-weight: 600;
      color: rgba(14, 48, 76, 1);
    }
    .con {
      .con-i {
        display: flex;
        font-family: PingFang-SC-Medium;
        padding-bottom: 20px;
        margin-top: 69px;
        border-bottom: 2px solid #EEF2F5;
        label {
          flex: 1;
          font-size: 30px;
          color: #4A647A;
        }
        input {
          flex: 4;
          font-size: 30px;
          color: #0E304C;
          border: none;
          outline: none;
          background: none;
        }
      }
      &::-webkit-input-placeholder {
        /* WebKit browsers */
        color: #adb7c1;
      }
      &:-moz-placeholder {
        /* Mozilla Firefox 4 to 18 */
        color: #adb7c1;
      }
      &::-moz-placeholder {
        /* Mozilla Firefox 19+ */
        color: #adb7c1;
      }
      &:-ms-input-placeholder {
        /* Internet Explorer 10+ */
        color: #adb7c1;
      }
    }
    .btn {
      margin-top: 46px;
      height: 86px;
      line-height: 86px;
      font-size: 30px;
      font-family: PingFang-SC-Medium;
      color: #fff;
      background: #3291EB;
      border-radius: 4px;
    }
  }

</style>
