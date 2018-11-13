<template>
  <!--买入卖出详情-->
  <div>
    <div class="headCon"><span class="goBack" @click="goBack"></span></div>
    <div class="main">
      <div class="con">
        <div class="tit">
          <span v-if="isBuy">买入</span>
          <span v-if="!isBuy">卖出</span>
          <span>{{item.CoinUnit}}</span>
        </div>
        <div class="price">¥ {{toDecimal(item.Price)}}</div>
        <div class="limit">
          <span>限额</span> {{toDecimal(item.MinTradeAmount)}} - {{toDecimal(item.MaxTradeAmount)}} CNY
        </div>
      </div>
      <div class="content">
        <div class="input-con" v-if="isBuy">
          <label>购买数量</label> <input type="text" placeholder="请输入购买数量" @keyup="changeMethods(volume)"
                                     v-model="volume"><span>{{item.CoinUnit}}</span>
        </div>
        <div class="input-con" v-if="!isBuy">
          <label>卖出数量</label> <input type="text" placeholder="请输入卖出数量" @keyup="changeMethods(volume)"
                                     v-model="volume"><span>{{item.CoinUnit}}</span>
        </div>
        <div class="input-con">
          <label>交易总额</label> <input type="text" disabled v-model="amount"><span>CNY</span>
        </div>
        <div class="btn">
          <!--<a href="javascript:void(0);" v-if="isBuy" @click="allBusiness(item.Price,item.MaxTradeAmount,item.Volume)">全部买入</a>-->
          <!--<a href="javascript:void(0);" v-if="!isBuy" @click="allBusiness(item.Price,item.MaxTradeAmount,item.Volume)">全部卖出</a>-->
        </div>
      </div>
      <div class="transactionNum">交易数量
        <span v-if="item.CoinUnit=='APPLE'">{{toDecimal(item.Volume)}} {{item.CoinUnit}}</span>
        <span v-else>{{item.Volume}} {{item.CoinUnit}}</span>
      </div>
      <!--    <div class="totalTransaction">
            <span>交易总额</span>
            <span class="totalMoney ">￥0.00</span>
          </div>-->
      <div class="buttonSubmit">
        <mt-button type="primary" size="large"
                   @click="buy(item.CoinUnit,item.MinTradeAmount,item.MaxTradeAmount)"
                   v-if="isBuy">买入
        </mt-button>
        <mt-button type="primary" size="large"
                   @click="buy(item.CoinUnit,item.MinTradeAmount,item.MaxTradeAmount)"
                   v-if="!isBuy">卖出
        </mt-button>
      </div>
    </div>
    <mt-popup
      v-model="popupVisible"
      position="bottom" class="popupVisible">
      <div>
        <div class="popup-tit">
          <span class="pop-tit">请输入资金密码</span> <span class="cancel" @click="cancel">取消</span>
        </div>
        <div class="moneyPassword">
          <input type="password" placeholder="请输入资金密码" class="password" v-model="SafePwd">
        </div>
        <div class="popBtn">
          <router-link to="/ForgetSafe" class="forgetPassword">忘记密码？</router-link>
          <mt-button class="sureBtn" type="primary" size="large" @click="sure(isBuy)">确定</mt-button>
        </div>
      </div>
    </mt-popup>
  </div>
</template>
<script type="text/babel">
  import {ApplyEntrust} from "@/service/CurrencytTrade";
  import {createNamespacedHelpers} from "vuex";
  const {mapState, mapMutations} = createNamespacedHelpers("pairs");
  import Verification from "@/assets/js/Verification";
  import Bus from "@/assets/js/bus";
  import {Popup, Toast} from 'mint-ui';
  export default {
    data(){
      return {
        popupVisible: false,
        isBuy: true,
        volume: '',
        price: 0.00,
        amount: 0.00,
        item: {},
        PaymentTypes: [],
        Payments: "",
        EntrustId: 0,
        TradeType: "Buy",
        TradeTypeName: "",
        SafePwd: ""
      }
    },
    i18n: {
      messages: {
        "zh-CN": {
          header: "公告列表"
        },
        "en-US": {
          header: "notice"
        }
      }
    },
    mounted(){
      this.item = JSON.parse(localStorage.getItem('currencyParams'));
      this.price = this.item.Price;
      this.PaymentTypes = this.item.PaymentTypes;
      this.Payments = this.item.Payments;
      this.EntrustId = this.item.EntrustId;
      this.TradeTypeName = this.item.TradeTypeName;
      if (this.item.TradeType == 'Buy') {
        this.isBuy = false;
        this.TradeType = 'Sell'
      }
      if (this.item.TradeType == 'Sell') {
        this.isBuy = true;
        this.TradeType = 'Buy'
      }
    },
    methods: {
      ...mapMutations([
        'setTheme'
      ]),
      changeMethods(val){   //购买（卖出）数量，输入触发时间正则验证
        if (this.item.CoinUnit == 'APPLE') {
          this.volume = Verification.setChange(val, 2)
        } else {
          this.volume = Verification.setChange(val, 6)
        }
        this.amount = this.toDecimal(this.price * this.volume);
      },
      goBack(){   //返回按钮
        this.$router.go(-1);
      },
      buy(CoinUnit, MinTradeAmount, MaxTradeAmount){   //点击买入按钮，正则匹配
        if (Number(this.amount) < Number(MinTradeAmount) || Number(this.amount) > Number(MaxTradeAmount)) {
          this.$toast({
            message: "您的订单金额不在对方的订单金额范围内！",
            position: 'top',
            duration: 3000
          });
          return false;
        }
        if (CoinUnit == 'APPLE') {
          if (this.volume % 100 != 0) {
            this.$toast({
              message: "数量要为100的整数倍！",
              position: 'top',
              duration: 3000
            });
            return false;
          }
        }
        this.popupVisible = true;
      },
      sure(isBuy) {   //输入资金密码提交，请求接口
        let type = '';
        if (isBuy) {
          type = '买入成功';
        } else {
          type = '卖出成功';
        }
        this.popupVisible = false;
        if (!this.SafePwd) {
          this.$toast({
            message: "资金密码不能为空！",
            duration: 2000
          });
          return false;
        }
        let option = {
          Volume: this.volume,
          PaymentTypes: this.PaymentTypes,
          Payments: this.Payments,
          EntrustId: this.EntrustId,
          TradeType: this.TradeType,
          TradeTypeName: this.TradeType,
          SafePwd: this.SafePwd
        }; // 参数
        const res = ApplyEntrust(option); // 调用请求传参
        res.then(data => {   // 成功
          this.SafePwd = '';
          if (Verification.handleData(data)) {
            this.$toast({
              message: type || "操作成功！",
              duration: 600,
              position: 'top'
            });
            setTimeout(() => {
              this.$router.push({path: '/orderRecordDetails', query: {id: data.Data,type:'3'}});
              localStorage.removeItem('currencyParams');
            }, 600)
          }
        });
        res.catch(err => {  // 失败
          this.SafePwd = '';
          console.log(err);
        });
      },
      cancel(){   //弹窗隐藏
        this.popupVisible = false;
      },
      allBusiness(price, MaxTradeAmount, Volume){
//          price 单价      MaxTradeAmount 最大总额    Volume 数量
        let totalVolume = Number(MaxTradeAmount) / Number(price);
        if (totalVolume > Volume) {   //计算总数量
          this.volume = Volume;
          this.amount = Number(price) * Number(Volume);
        } else {
          this.volume = Number(MaxTradeAmount) / Number(price);
          this.amount = MaxTradeAmount;
        }
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
        this.setTheme(themeName)
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

  .clearFl:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0
  }

  .clearFl {
    zoom: 1
  }

  .headCon {
    padding-left: 60px;
    height: 88px;
    line-height: 88px;
    position: relative;
    .goBack {
      position: absolute;
      top: 28px;
      left: 46px;
      width: 30px;
      height: 30px;
      @include bg-icon('goBack.png', 30px);
    }
  }

  .mint-popup {
    width: 100%;
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

  .main {
    .con {
      margin-left: 60px;
      margin-top: 39px;
      .tit {
        font-size: 52px;
        font-family: PingFang-SC-Heavy;
        font-weight: 600;
        color: rgba(14, 48, 76, 1);
      }
      .price {
        font-size: 30px;
        margin-top: 18px;
        font-family: PingFang-SC-Bold;
        font-weight: bold;
        color: rgba(50, 145, 235, 1);
      }
      .limit {
        font-size: 26px;
        margin-top: 18px;
        font-family: PingFang-SC-Bold;
        color: rgba(128, 135, 142, 1);
      }
    }
    .content {
      margin: 60px 40px 0;
      box-shadow: 0 0 24px 0px rgba(13, 76, 135, 0.3);
      padding: 10px;
      .input-con {
        margin-top: 60px;
        padding-bottom: 10px;
        color: #4A647A;
        font-size: 28px;
        font-weight: 600;
        border-bottom: 2px solid #EEF2F5;
        position: relative;
        label {
          position: relative;
          top: 3px;
          margin-left: 10px;
        }
        input {
          width: 56%;
          height: 30px;
          vertical-align: middle;
          font-size: 26px;
          margin-left: 16px;
          padding: 10px;
          border: none;
          outline: none;
          background: none;
        }
        span {
          position: absolute;
          right: 0;
          bottom: 10px;
        }
      }
      .btn {
        margin-top: 20px;
        text-align: right;
        padding-right: 19px;
        padding-bottom: 35px;
        a {
          font-size: 26px;
          font-family: PingFang-SC-Bold;
          font-weight: 600;
          color: rgba(50, 145, 235, 1);
        }
      }
    }
    .transactionNum {
      font-size: 24px;
      font-family: PingFang-SC-Bold;
      color: rgba(74, 100, 122, 1);
      padding: 40px;
      text-align: right;
      span {
        margin-right: 10px;
      }
    }
    .totalTransaction {
      margin: 0 40px;
      font-size: 26px;
      font-family: PingFang-SC-Bold;
      font-weight: bold;
      color: rgba(74, 100, 122, 1);
      padding: 10px;
      position: relative;
      .totalMoney {
        font-size: 34px;
        font-family: PingFang-SC-Heavy;
        font-weight: 800;
        color: rgba(50, 145, 235, 1);
        position: absolute;
        right: 0;
        bottom: 3px;
      }

    }
    .buttonSubmit {
      padding: 40px;
      margin-left: 10px;

      /deep/ .mint-button {
        height: 80px;
        font-size: 30px;
        font-family: PingFang-SC-Bold;
        letter-spacing: 10px;
        background-color: #3291EB;
      }
    }
  }

</style>
