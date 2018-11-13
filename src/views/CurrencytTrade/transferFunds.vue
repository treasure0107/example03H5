<template>
  <div>
    <div class="headCon">
      <span class="goBack" @click="$router.go(-1)"></span>
      <span class="cancel" @click="transferRecord(CurrencyUnit)">划转记录</span>
    </div>
    <section class="con">
      <div class="tit">
        <span>{{CurrencyUnit}}</span>资金划转
      </div>
      <div class="main">
        <div class="account-c">
          <div class="account-l" v-show="isSwitch">
            <span class="m-icon">从</span>
            <span>法币账户</span>
          </div>
          <div class="account-l" v-show="!isSwitch">
            <span class="m-icon">从</span>
            <span>币币账户</span>
          </div>
          <div class="switchover" @click="switchover">
            <a href="javascript:void(0);"></a>
            <p>切换</p>
          </div>

          <div class="account-r" v-show="isSwitch">
            <span class="m-icon">至</span>
            <span>币币账户</span>
          </div>
          <div class="account-r" v-show="!isSwitch">
            <span class="m-icon">至</span>
            <span>法币账户</span>
          </div>
        </div>
        <div class="num">
          <span>划转数量</span>
          <input type="text" v-model="Amount" placeholder="请输入划转和数量" @keyup="changeMethods(Amount)">
          <a href="javascript:void(0);" @click="all">全部划转</a>
        </div>
        <div class="icon-num">可划转数量:
          <span v-if="CurrencyUnit=='APPLE'"> {{toDecimal(allAmount)}} {{CurrencyUnit}}</span>
          <span v-else> {{allAmount}} {{CurrencyUnit}}</span>
        </div>
        <mt-button class="sureBtn" type="primary" size="large" @click="submitBtn">提交</mt-button>
      </div>
    </section>
    <!--输入资金密码-->
    <mt-popup
      v-model="popupVisible"
      position="bottom"
      class="popupVisible">
      <div>
        <div class="popup-tit">
          <span class="pop-tit">请输入资金密码</span> <span class="cancel" @click="popupVisible=false;">取消</span>
        </div>
        <div class="moneyPassword">
          <input type="password" placeholder="请输入资金密码" class="password" v-model="Safepwd">
        </div>
        <div class="popBtn">
          <router-link to="/ForgetSafe" class="forgetPassword">忘记密码？</router-link>
          <mt-button class="sureBtn" type="primary" size="large" @click="sure()">确定</mt-button>
        </div>
      </div>
    </mt-popup>
  </div>
</template>
<script type="text/babel">
  import TheFooter from '@/components/footer'
  import {Transfer, GetUserAsset} from "@/service/CurrencytTrade";
  import {createNamespacedHelpers} from "vuex";
  import Verification from "@/assets/js/Verification";
  const {mapState, mapMutations} = createNamespacedHelpers("pairs");
  import {Toast} from 'mint-ui';
  export default {
    name: "transferFunds",
    data () {
      return {
        msg: "transferFunds",
        isSwitch: true,
        popupVisible: false,
        item: {},
        allAmount: 0,
        Transfer: "OtcToMarket",   // 法币到币币 OtcToMarket, MarketToOtc币币到法币
        Safepwd: "",
        Amount: "",
        CurrencyUnit: "",
        routerParams: ''
      }
    },
    mounted(){
      this.CurrencyUnit = this.$route.query.unit;
      this.getData();
//      this.allAmount = this.item.OTCAsset.Available;
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
    methods: {
      ...mapMutations([
        'setTheme'
      ]),
      changeMethods(val){
        if (this.CurrencyUnit == 'APPLE') {
          this.Amount = Verification.setChange(val, 2)
        } else {
          this.Amount = Verification.setChange(val, 6)
        }
      },
      toDecimal(decimal){   //保留两位小数
        if (decimal) {
          return Number(decimal).toFixed(3).slice(0, -1);
        }
      },
      getData() {   //根据币种获取币种详情
        let option = {}; // 参数
        const res = GetUserAsset(option); // 调用请求传参
        res.then(data => {
          // 成功
          if (Verification.handleData(data)) {
//            console.log(data.Data);
            if (data.Data) {
              data.Data.forEach((param, i) => {
//                console.log(param.CoinInfo.CoinUnit);
                if (this.CurrencyUnit == param.CoinInfo.CoinUnit) {
                  if (param) {
                    this.item = param;
                    this.allAmount = this.item.OTCAsset.Available;
                    this.CurrencyUnit = this.item.CoinInfo.CoinUnit;
                    if (!this.isSwitch) {
                      this.allAmount = this.item.MarketAsset.Available;
                    } else {
                      this.allAmount = this.item.OTCAsset.Available;
                    }
                  }
                }
              })
            }
          }
        });
        res.catch(err => {
          // 失败
          console.log(err);
        });
      },
      goBack(){   //返回按钮
        this.$router.push({path: '/currencyList'});
      },
      transferRecord(item){
        this.$router.push({path: '/transferRecord', query: {unit: item}});
      },
      switchover(){
        if (!this.isSwitch) {
          this.allAmount = this.item.OTCAsset.Available;
          this.Transfer = "OtcToMarket";
          this.isSwitch = true;
        } else {
          this.allAmount = this.item.MarketAsset.Available;
          this.Transfer = "MarketToOtc";
          this.isSwitch = false;
        }
      },
      all(){
        if (this.CurrencyUnit == 'APPLE') {
          this.Amount = this.toDecimal(this.allAmount)
        } else {
          this.Amount = this.allAmount;
        }
      },
      submitBtn(){   //提交按钮
        if (Number(this.Amount) > Number(this.allAmount)) {
          this.$toast({
            message: "划转数量不能大于可划转数量！",
            position: 'top',
            duration: 3000
          });
          return false;
        }
        if (this.allAmount == 0) {
          this.$toast({
            message: "可划转数量为零！",
            position: 'top',
            duration: 3000
          });
          return false;
        }
        this.popupVisible = true;
      },
      sure() {   //输入资金密码确定按钮 提交请求接口
        this.popupVisible = false;
        let option = {
          Transfer: this.Transfer,
          Safepwd: this.Safepwd,
          Amount: this.Amount,
          CurrencyUnit: this.CurrencyUnit
        }; // 参数
//        console.log(option);
        const res = Transfer(option); // 调用请求传参
        res.then(data => {
          // 成功
          this.Safepwd = '';
          if (Verification.handleData(data)) {
            this.getData();
            this.$router.push({path: '/transferRecord', query: {unit: this.CurrencyUnit}});
          }
        });
        res.catch(err => {
          // 失败
          this.Safepwd = '';
          console.log(err);
        });
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
        this.setTheme(themeName)
        localStorage.setItem('theme', themeName)
      },
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
    /*box-shadow: 0px 6px 12px 0px rgba(197, 210, 229, 0.27);*/
    .goBack {
      position: absolute;
      top: 28px;
      left: 30px;
      width: 30px;
      height: 30px;
      @include bg-icon('goBack.png', 30px);
    }
    .cancel {
      position: absolute;
      right: 30px;
      font-size: 26px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(80, 86, 92, 1);
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

  .con {
    margin: 30px;
    .tit {
      font-size: 52px;
      font-family: PingFang-SC-Heavy;
      font-weight: 600;
      color: #0E304C;
      margin-bottom: 75px;
    }
    .main {
      .account-c {
        font-size: 36px;
        font-family: PingFang-SC-Medium;
        padding: 69px 30px;
        border-radius: 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 0 24px 0 rgba(13, 76, 135, 0.3);
        .account-l {
          flex: 2;
          text-align: left;
        }
        .account-r {
          flex: 2;
          text-align: right;
        }
        .switchover {
          flex: 1;
          text-align: center;
          a {
            display: inline-block;
            width: 40px;
            height: 33px;
            @include bg-icon('iconSwitchover.png', 40px, 33px);
            vertical-align: middle;
          }
          p{
            font-size:20px;
            font-family:PingFang-SC-Medium;
            color:#3291EB;
          }
        }
        .m-icon {
          color: #ADB7C1;
        }
      }
      .num {
        margin-top: 46px;
        padding-bottom: 16px;
        border-bottom: 1px solid #EEF2F5;
        display: flex;
        span {
          font-size: 30px;
          font-family: PingFang-SC-Medium;
          color: #4A647A;
          flex: 1;
          text-align: left;
        }
        input {
          height: 40px;
          line-height: 40px;
          font-size: 32px;
          font-family: PingFang-SC-Heavy;
          color: #0E304C;
          border: none;
          flex: 2;
          text-align: left;
          outline: none;
        }
        input::-webkit-input-placeholder {
          font-size: 30px;
          text-align: left;
          color: #ADB7C1;
        }
        a {
          font-size: 24px;
          font-family: PingFang-SC-Medium;
          color: #3291EB;
          flex: 1;
          text-align: right;
        }
      }
      .icon-num {
        font-size: 24px;
        margin-top: 26px;
        font-family: PingFang-SC-Medium;
        color: #ADB7C1;
      }
      .sureBtn {
        margin-top: 60px;
        height: 86px;
        font-size: 30px;
        font-family: PingFang-SC-Bold;
        background-color: #3291EB;
        border-radius: 4px;
      }
    }
  }
</style>
