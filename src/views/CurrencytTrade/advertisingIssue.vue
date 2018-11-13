<template>
  <div class="container">
    <div class="headCon">
      <span class="goBack" @click="goBack"></span>
      <span>发布广告</span>
    </div>
    <section class="main">
      <!--<div class="m-tit">发布广告</div>-->
      <div class="con">
        <div class="con-i" @click="popupVisibleTrade=true;">
          <label>交易类型</label><input type="text" disabled placeholder="请选择交易类型" v-model="TradeTypeName">
          <span class="icon">
            <span class="arrow-icon"></span>
          </span>
        </div>
        <div class="con-i" @click="popupVisibleCurrency=true;">
          <label>交易币种</label><input type="text" disabled placeholder="请选择交易币种" v-model="CoinUnit">
          <span class="icon">
            <span class="arrow-icon"></span>
          </span>
        </div>
        <div class="con-i">
          <label>单价</label><input type="text" placeholder="请输入单价" v-model="Price"
                                  @keyup="changeMethods(Price,'Price')">
          <span class="icon">CNY</span>
        </div>
        <div class="con-i">
          <label>数量</label><input type="text" placeholder="请输入数量" v-model="Volume"
                                  @keyup="changeMethods(Volume,'Volume')">
          <span class="icon">{{CoinUnit}}</span>
        </div>
        <div class="icon-hint" v-show="TradeType=='Sell' && CoinUnit">
          <span>可用: </span>
          <span v-for="(item, index) in UserAssetList" v-show="item.CoinInfo.CoinUnit==CoinUnit">
            <span v-if="item.CoinInfo.CoinUnit=='APPLE'">{{toDecimal(item.Available)}}</span>
            <span v-else>{{item.Available}}</span>
            {{item.CoinInfo.CoinUnit}}
          </span>
        </div>
        <div class="con-i">
          <label>单笔最小成交额</label><input type="text" placeholder="请输入金额(最少为100)" v-model="MinTradeAmount"
                                       @keyup="changeMethods(MinTradeAmount,'MinTradeAmount')">
          <span class="icon">CNY</span>
        </div>
        <div class="con-i">
          <label>单笔最大成交额</label><input type="text" placeholder="请输入金额" v-model="MaxTradeAmount"
                                       @keyup="changeMethods(MaxTradeAmount,'MaxTradeAmount')">
          <span class="icon">CNY</span>
        </div>
        <div class="payment-m" v-show="paymentMethod">
          <p>收款方式</p>
          <div class="select-m">
            <span class="active" v-show="isBank">银行卡</span>
            <span :class="{active:isActive}" v-show="isAlipay" @click="isSelect('Alipay')">支付宝</span>
          </div>
        </div>
      </div>
      <div>
        <mt-button type="primary" size="large" class="btn" @click="Advertising">发布广告</mt-button>
      </div>
    </section>
    <!--弹窗-->
    <!--交易类型-->
    <mt-popup
      v-model="popupVisibleTrade"
      position="bottom" class="popupVisibleTrade">
      <div class="popup-item" @click="tradeSelect ('Buy','买入')">买入</div>
      <div class="popup-item" @click="tradeSelect('Sell','卖出')">卖出</div>
      <div class="line-popup"></div>
      <div class="popup-item" @click="popupVisibleTrade=false;" style="color:#80878E;">取消</div>
    </mt-popup>
    <!--交易币种-->
    <mt-popup
      v-model="popupVisibleCurrency"
      position="bottom" class="popupVisibleTrade">
      <div class="popup-item" v-for="(item, index) in CoinList" @click="currencySelect(item.CoinUnit)">
        {{item.CoinUnit}}
      </div>
      <div class="line-popup"></div>
      <div class="popup-item" @click="popupVisibleCurrency=false;" style="color:#80878E;">取消</div>
    </mt-popup>
    <mt-popup
      v-model="popupVisible"
      position="bottom"
      class="popupVisible">
      <div>
        <div class="popup-tit">
          <span class="pop-tit">请输入资金密码</span> <span class="cancel" @click="popupVisible = false;">取消</span>
        </div>
        <div class="moneyPassword">
          <input type="password" placeholder="请输入资金密码" class="password" v-model="SafePwd">
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
      <div class="popup-con">请先设置收款方式</div>
      <div class="popBtn" @click="$router.push('receivingSet')">去设置</div>
    </mt-popup>
  </div>
</template>
<script type="text/babel">
  import {GetCoinList, GetEnablePayment, GetUserAsset, PublishEntrust} from "@/service/CurrencytTrade";
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
        popupVisibleTrade: false,   //交易类型
        popupVisibleCurrency: false,   //交易币种
        isActive: false,
        CoinList: [],
        UserAssetList: [],
        isBank: false,
        isAlipay: false,
        BankId: '',
        AlipayId: '',
        Volume: '',
        MaxTradeAmount: '',
        MinTradeAmount: '',
        PaymentIds: [],
        TradeType: "Buy",
        TradeTypeName: "买入",
        paymentMethod: false,
        CoinUnit: '',
        Price: '',
        SafePwd: '',
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
      this.getCoinList();
      this.getEnablePayment();
      this.getUserAsset();
    },
    methods: {
      ...mapMutations([
        'setTheme'
      ]),
      changeMethods(val, type){   //输入触发正则验证
        if (type == 'Price') {
          this.Price = Verification.setChange(val, 2);
        } else if (type == 'MinTradeAmount') {
          this.MinTradeAmount = Verification.setChange(val, 2);
        } else if (type == 'MaxTradeAmount') {
          this.MaxTradeAmount = Verification.setChange(val, 2);
        }
        if (type == 'Volume') {
          if (this.CoinUnit == 'APPLE') {
            this.Volume = Verification.setChange(val, 2)
          } else {
            this.Volume = Verification.setChange(val, 6)
          }
        }


      },
      isSelect(type){
        if (type == 'Alipay') {
          if (this.isActive) {
            this.isActive = false;
          } else {
            this.isActive = true;
          }
        }
      },
      goBack(){
        this.$router.go(-1);
      },
      tradeSelect(TradeType, TradeTypeName){   //买卖选择
        this.TradeType = TradeType;
        this.TradeTypeName = TradeTypeName;
        if (this.TradeType == 'Buy') {
          this.paymentMethod = false;
        } else {
          this.paymentMethod = true;
        }
        this.popupVisibleTrade = false;
      },
      currencySelect(CoinUnit){
        this.CoinUnit = CoinUnit;
        this.popupVisibleCurrency = false;
      },
      getCoinList(){
        let option = {}; // 参数
        const res = GetCoinList(option); // 调用请求传参
        res.then(data => {   // 成功
          this.CoinList = data.Data;
        });
        res.catch(err => {  // 失败
          console.log(err);
        });
      },
      getEnablePayment(){
        let option = {}; // 参数
        const res = GetEnablePayment(option); // 调用请求传参
        res.then(data => {   // 成功
          if (data.Data.Bank) {
            if (data.Data.Bank.length) {
              this.isBank = true;
              let BankList = data.Data.Bank;
              for (var i = 0; i < BankList.length; i++) {
                this.BankId = BankList[0].Id;
              }
            } else {
              this.isBank = false;
              this.popupVisibleIcon = true;
            }
          }
          if (data.Data.Alipay) {
            if (data.Data.Alipay.length) {
              this.isAlipay = true;
              let AlipayList = data.Data.Alipay;
              for (var i = 0; i < AlipayList.length; i++) {
                this.AlipayId = AlipayList[0].Id;
              }
            } else {
              this.isAlipay = false;
            }
          }
        });
        res.catch(err => {  // 失败
          console.log(err);
        });
      },
      getUserAsset(){
        let option = {}; // 参数
        const res = GetUserAsset(option); // 调用请求传参
        res.then(data => {   // 成功
          this.UserAssetList = data.Data;
        });
        res.catch(err => {  // 失败
          console.log(err);
        });
      },
      sure() {   //添加银行卡
        this.popupVisible = false;
        if (!this.SafePwd) {
          this.$toast({
            message: "资金密码不能为空！",
            duration: 1000
          });
          return false;
        }
        this.PaymentIds = [];
        if (this.TradeType == 'Sell') {
          if (this.isBank && this.BankId) {
            this.PaymentIds.push(this.BankId)
          }
          if (this.isAlipay && this.isActive && this.AlipayId) {
            this.PaymentIds.push(this.AlipayId)
          }
        }
        let option = {
          Volume: this.Volume,
          Price: this.Price,
          MaxTradeAmount: this.MaxTradeAmount,
          MinTradeAmount: this.MinTradeAmount,
          PaymentIds: this.PaymentIds,
          TradeType: this.TradeType,
          CoinUnit: this.CoinUnit,
          SafePwd: this.SafePwd
        }; // 参数
        const res = PublishEntrust(option); // 调用请求传参
        res.then(data => {
          this.SafePwd = '';
          // 成功
          if (Verification.handleData(data)) {
            this.$toast({
              message: data.Data.Msg || "发布广告成功！",
              duration: 600,
              position: 'top'
            });
            setTimeout(() => {
              this.$router.push({path: '/advertisingDetails', query: {entrustId: data.Data}});
            }, 600)

          }
        });
        res.catch(err => {
          // 失败
          this.SafePwd = '';
          console.log(err);
        });
      },
      Advertising(){   //点击保存，资金密码弹窗显示（条件判断）
        if (!this.CoinUnit) {
          this.$toast({
            message: "请选择交易币种！",
            position: 'top',
            duration: 3000
          });
          return false;
        }
        if (!this.Price) {
          this.$toast({
            message: "单价不能为空！",
            position: 'top',
            duration: 3000
          });
          return false;
        }
        if (!this.Volume) {
          this.$toast({
            message: "数量不能为空！",
            position: 'top',
            duration: 3000
          });
          return false;
        }
        if (!this.MinTradeAmount) {
          this.$toast({
            message: "最小成交额不能为空！",
            position: 'top',
            duration: 3000
          });
          return false;
        }
        if (!this.MaxTradeAmount) {
          this.$toast({
            message: "最大成交额不能为空！",
            position: 'top',
            duration: 3000
          });
          return false;
        }
        if (Number(this.MinTradeAmount) > Number(this.Price * this.Volume)) {
          this.$toast({
            message: "单价，和数量的乘积要大于单笔最小成交额！",
            position: 'top',
            duration: 3000
          });
          return false;
        }
        if (Number(this.MinTradeAmount) < 100) {
          this.$toast({
            message: "单笔最小成交额，应最少为100！",
            position: 'top',
            duration: 3000
          });
          return false;
        }
        if (Number(this.MinTradeAmount) > Number(this.MaxTradeAmount)) {
          this.$toast({
            message: "最小成交额不能大于最大成交额！",
            position: 'top',
            duration: 3000
          });
          return false;
        }

        this.popupVisible = true;
      },
      toDecimal(decimal){   //保留两位小数
        if (decimal) {
          return Number(decimal).toFixed(3).slice(0, -1);
        }
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

  .popupVisibleTrade {
    width: 100%;
    .popup-item {
      width: 100%;
      height: 90px;
      line-height: 90px;
      font-size: 28px;
      text-align: center;
      font-family: PingFang-SC-Bold;
      font-weight: 600;
      background-color: #fff;
      color: #4A647A;
      border-bottom: 2px solid #EEF2F5;
    }
    .line-popup {
      width: 100%;
      height: 10px;
      background-color: rgba(0, 0, 0, .5);
    }
  }

  .main {
    padding: 20px 30px;
    .con {
      .con-i {
        display: flex;
        font-family: PingFang-SC-Medium;
        padding-bottom: 20px;
        margin-top: 60px;
        border-bottom: 2px solid #EEF2F5;
        font-size: 30px;
        label {
          flex: 3;
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
        .icon {
          flex: 1;
          text-align: right;
          font-size: 30px;
          color: #0E304C;
        }
        .arrow-icon {
          width: 16px;
          height: 31px;
          display: inline-block;
          @include bg-icon('arrowPic.png', 16px, 31px);
        }
      }
      .icon-hint {
        font-size: 24px;
        font-family: PingFang-SC-Medium;
        margin-top: 10px;
        span:first-child {
          color: #ADB7C1;
        }
        span:last-child {
          color: #0E304C;
        }
      }
      .payment-m {
        p {
          font-size: 30px;
          font-family: PingFang-SC-Medium;
          color: #4A647A;
          margin-top: 30px;
        }
        .select-m {
          font-size: 28px;
          font-family: PingFang-SC-Medium;
          color: #4A647A;
          height: 66px;
          margin-top: 39px;
          span {
            display: inline-block;
            width: 168px;
            height: 62px;
            text-align: center;
            line-height: 62px;
            margin-right: 50px;
            border: 1px solid #adb7c1;
            box-sizing: border-box;
          }
          .active {
            @include bg-icon('selectedIcon.png', 168px, 62px);
            border: none;
          }
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
      height: 86px;
      line-height: 86px;
      margin-top: 46px;
      font-size: 30px;
      font-family: PingFang-SC-Medium;
      color: #fff;
      background: #3291EB;
      border-radius: 4px;
    }
  }

</style>
