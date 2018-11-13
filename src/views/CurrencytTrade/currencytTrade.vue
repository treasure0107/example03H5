<template>
  <!-- 法币交易 -->
  <div class="content">
    <div class="header">
      <div class="header-con">
        <router-link to="/orderRecord" class="recordPic"></router-link>
        <div class="buySale">
          <span class="buy" :class="{ active: isActive }" @click="isBuy('Buy')">{{$t('buy')}}</span>
          <span class="sale" :class="{ activeBgc: !isActive }" @click="isBuy('Sell')">{{$t('sale')}}</span>
        </div>
        <span class="filterCondition" @click="filterCondition"></span>
      </div>
      <div class="currencyType">

        <ul class="title">
          <li :class="{sel:coinType == index}" @click="currency(index,item.CoinUnit)"
              v-for="(item, index) in coinLst"><span>
            {{item.CoinUnit}}</span></li>
          <!-- <li :class="{sel:coinType == 1}" @click="currency(1)"><span>APPLE</span></li>
           <li :class="{sel:coinType == 2}" @click="currency(2)"><span>USDT</span></li>
           <li :class="{sel:coinType == 3}" @click="currency(3)"><span>BTC</span></li>
           <li :class="{sel:coinType == 4}" @click="currency(4)"><span>SLT</span></li>
           <li :class="{sel:coinType == 5}" @click="currency(5)"><span>ADA</span></li>
           <li :class="{sel:coinType == 6}" @click="currency(6)"><span>ETH</span></li>-->
        </ul>
      </div>
    </div>
    <div class="main" :style="{height:height}">
      <mt-loadmore
        :top-method="loadTop"
        :bottom-method="loadBottom"
        :bottom-all-loaded="allLoaded"
        ref="loadmore"
        :auto-fill="false"
        :bottomPullText="text"
        @bottom-status-change="handleBottomChange">
        <ul>
          <li @click="routerLink(item,item.Merchant.OnlineStatus)" v-for="(item, index) in list">
            <div class="personNews">
              <span class="headPhoto">
              <img v-if="item.Merchant.Avatar" :src="item.Merchant.Avatar" alt="">
              <span class="online" v-if="item.Merchant.OnlineStatus"></span>
              <span class="offline" v-if="!item.Merchant.OnlineStatus"></span>
            </span>
              <span class="newsTit">{{item.Merchant.NickName}}</span>
              <span class="news">
              <span>{{item.Merchant.CompleteVolume}}</span>
              <span class="middleLine" v-if="item.Merchant.CompletionRate">|</span>
              <span v-if="item.Merchant.CompletionRate">{{toDecimal(item.Merchant.CompletionRate)}}%</span>
            </span>
              <span v-for="(param, i) in item.PaymentTypes">
              <span class="alipayPic" v-if="param=='Alipay'"></span>
              <span class="bankCardPic" v-if="param=='Bank'"></span>
            </span>
            </div>
            <div class="con">
              <div class="conLeft">
                <p class="TitName">{{$t('unitPrice')}}</p>
                <p class="price">￥{{toDecimal(item.Price)}}</p>
              </div>
              <div class="conRight">
                <p>
                  <span style="margin-right: 10px;">{{$t('number')}}</span>
                  <span v-if="item.CoinUnit=='APPLE'">{{toDecimal(item.Volume)}} {{item.CoinUnit}}</span>
                  <span v-else>{{item.Volume}} {{item.CoinUnit}}</span>
                </p>
                <p>
                  <span style="margin-right: 10px;">{{$t('limit')}}</span>
                  <span>{{toDecimal(item.MinTradeAmount)}} - {{toDecimal(item.MaxTradeAmount)}} CNY</span>
                </p>
              </div>
            </div>
          </li>
        </ul>
        <div class="tips" v-show="moreTips">没有更多数据了...</div>
        <div class="addIssue" @click="$router.push('/advertisingIssue')" v-show="IsOtcMerchant">
          <span class="advertise-icon"></span>
          <span>发布广告</span>
        </div>
      </mt-loadmore>
    </div>
    <mt-popup
      v-model="popupVisiblePay"
      position="bottom" class="popupVisiblePay">
      <div class="popup-item" @click="PaymentTypeBtn('None')">全部</div>
      <div class="popup-item" @click="PaymentTypeBtn('Bank')">银行卡</div>
      <div class="popup-item" @click="PaymentTypeBtn('Alipay')">支付宝</div>
      <div class="line-popup"></div>
      <div class="popup-item" @click="popupVisiblePay=false;">取消</div>
    </mt-popup>
    <!--设置昵称-->
    <mt-popup
      v-model="popupVisibleSet"
      class="popupVisibleSet">
      <div>
        <div class="popup-tit">
          <span class="pop-tit">设置昵称</span> <span class="cancel" @click="cancel"></span>
        </div>
        <div class="nickname-con">
          <input type="text" placeholder="设置成功不能修改" class="nickname" v-model="nickName" maxlength="5">
        </div>
        <div class="popBtn">
          <a href="javascript:void (0)" @click="sureUpdateUserInfo">确定</a>
        </div>
      </div>
    </mt-popup>
    <the-footer></the-footer>
  </div>
</template>
<script>
  import TheFooter from '@/components/footer';
  import {GetCoinLst, GetUserInfo, UpdateUserInfo, getEntrustQuery} from "@/service/CurrencytTrade";
  import {createNamespacedHelpers} from "vuex";
  const {mapState, mapMutations} = createNamespacedHelpers("pairs");
  import Verification from "@/assets/js/Verification";
  import Bus from "@/assets/js/bus";
  import {InfiniteScroll, Popup, Toast} from 'mint-ui';
  export default {
    name: "currencytTrade",
    data() {
      return {
        msg: "currencytTrade",
        isActive: true,
        popupVisiblePay: false,
        popupVisibleSet: false,
        coinType: 0,
        nickName: "",
        Avatar: "",
        Tradetype: "Buy",  // 交易类型  Sell
        CoinUnit: "",   //币种单位
        PaymentType: "None",   //支付类型 ['None', 'Bank', 'Alipay'],
        PageIndex: 1,
        PageSize: 10,
        list: [],
        coinLst: [],
        total: 0,
        allLoaded: false,
        text: "上拉加载更多",
        moreTips: false,
        height: "",
        IsOtcMerchant: false
      };
    },
    i18n: {
      messages: {
        "zh-CN": {
          lang: "中文",
          buy: '买入',
          sale: '卖出',
          unitPrice: '单价',
          number: '数量',
          limit: '限额',
        },
        "en-US": {
          lang: "English",
          buy: 'buy',
          sale: 'sale',
          unitPrice: 'unitPrice',
          number: 'number',
          limit: 'limit',
        }
      }
    },
    components: {
      TheFooter
    },
    mounted() {
      this.getCoinLst();
      this.getList();
      if (window.localStorage.getItem('token')) {
        this.getUserInfo();
      }
      this.height = document.documentElement.clientHeight - 60 + "px"; // 滚动dom高度
      localStorage.removeItem('currencyParams');
      /* this.setDefaultLanguage();*/
    },
    methods: {
      ...mapMutations([
        'setTheme'
      ]),
      // 下拉刷新
      loadTop() {
        this.PageIndex = 1;
        this.getList();
      },
      // 上拉加载更多
      loadBottom() {
        if (this.PageIndex == this.total) {
          this.allLoaded = true;
          this.$refs.loadmore.onBottomLoaded();
        } else {
          this.PageIndex += 1;
          let option = {
            Tradetype: this.Tradetype,
            CoinUnit: this.CoinUnit,
            PaymentType: this.PaymentType,
            PageIndex: this.PageIndex,
            PageSize: this.PageSize
          }; // 参数
          const res = getEntrustQuery(option); // 调用请求传参
          res.then(data => {
            if (Verification.handleData(data)) {
              this.list = this.list.concat(data.Data.DataList);
              this.$refs.loadmore.onBottomLoaded();
            }
          });
          res.catch(error => {
          });
        }
      },
      // 无更多数据
      handleBottomChange() {
        if (this.allLoaded == true) {
          this.moreTips = true;
        }
      },
      routerLink(item, OnlineStatus){   //跳转
        if (OnlineStatus) {   //判断用户在不在线
          this.$router.push({path: '/orderDetails'});
          localStorage.setItem('currencyParams', JSON.stringify(item))
//          Bus.$emit("currencyParamsEvent", item);
        } else {
          this.$toast({
            message: "用户不在线！",
            duration: 3000,
            position: 'top'
          });
        }
      },
      filterCondition(){   //点击筛选弹窗显示
        this.popupVisiblePay = true;
      },
      currency(type, CoinUnit){   //点击币种
        this.coinType = type;
        this.CoinUnit = CoinUnit;
        this.getList();
      },
      isBuy(type){   //买入卖出切换， Tradetype: "Buy",  // 交易类型  Sell
        if (type == 'Buy') {
          this.isActive = true;
        }
        if (type == 'Sell') {
          this.isActive = false;
        }
        this.Tradetype = type;
        this.getList();
      },
      PaymentTypeBtn(type){   //选择支付方式，筛选
        this.PaymentType = type;
        this.popupVisiblePay = false;
        this.getList();
      },
      cancel(){   //弹窗隐藏
        this.popupVisibleSet = false;
      },
      getCoinLst() {   //获取币种数据（币种单位）
        let option = {}; // 参数
        const res = GetCoinLst(option); // 调用请求传参
        res.then(data => {   // 成功
          if (Verification.handleData(data)) {
            this.coinLst = data.Data;
          }
        });
        res.catch(err => {  // 失败
          console.log(err);
        });
      },
      getUserInfo() {   //后去用户详情
        let option = {}; // 参数
        const res = GetUserInfo(option); // 调用请求传参
        res.then(data => {   // 成功
          if (Verification.handleData(data)) {
            if (data.Data) {
              if (data.Data.NickName) {
                this.popupVisibleSet = false;
              } else {
                this.popupVisibleSet = true;
              }
              this.IsOtcMerchant = data.Data.IsOtcMerchant;   //判断是否是商家
            }
          }
        });
        res.catch(err => {  // 失败
          console.log(err);
        });
      },
      sureUpdateUserInfo() {   //设置昵称
        if (!this.nickName) {
          this.$toast({
            message: "请输入昵称在设置！",
            position: 'top',
            duration: 3000
          });
          return false;
        }
        let option = {
          NickName: this.nickName,
          Avatar: this.Avatar
        }; // 参数
        const res = UpdateUserInfo(option); // 调用请求传参
        res.then(data => {
          // 成功
          if (Verification.handleData(data)) {
            this.popupVisibleSet = false;
            let instance = Toast({
              message: data.Data.Msg || '设置昵称成功',
              position: 'top',
              duration: 1000
            });
            setTimeout(() => {
              instance.close();
            }, 1000);
          }
        });
        res.catch(err => {
          // 失败
          console.log(err);
        });
      },
      getList() {   //获取法币列表数据，查询盘口订单
        let option = {
          Tradetype: this.Tradetype,
          CoinUnit: this.CoinUnit,
          PaymentType: this.PaymentType,
          PageIndex: this.PageIndex,
          PageSize: this.PageSize
        }; // 参数
        const res = getEntrustQuery(option); // 调用请求传参
        res.then(data => {   // 成功
          if (Verification.handleData(data)) {
            this.list = data.Data.DataList;
            this.total = data.Data.PageCount;
            this.$refs.loadmore.onTopLoaded();
          }
        });
        res.catch(err => {
          // 失败
          console.log(err);
        });
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
      },
    },
    computed: {
      ...mapState([
        'theme',
      ])
    },
  };
</script>
<style lang='scss' scoped>
  @import '~@/design/scoped';

  ul, li, p {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  a {
    text-decoration: none;
  }

  .clearfloat:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0
  }

  .clearfloat {
    zoom: 1
  }

  .popupVisiblePay {
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

  .popupVisibleSet {
    width: 540px;
    border-radius: 4px;
    background-color: #fff;
    input {
      border: none;
      outline: none;
      background: none;
    }
    .popup-tit {
      text-align: center;
      margin-top: 33px;
      position: relative;
      .pop-tit {
        font-size: 34px;
        font-family: PingFang-SC-Heavy;
        font-weight: 600;
        color: rgba(14, 48, 76, 1);
      }
      .cancel {
        position: absolute;
        right: 26px;
        top: 10px;
        @include bg-icon('closePic.png', 26px);
      }
    }
    .nickname-con {
      padding: 50px 70px;
      border-bottom: 1px solid #CFD6DB;
      .nickname {
        padding: 0 10px;
        width: 100%;
        font-size: 26px;
        font-family: PingFang-SC-Medium;
        height: 80px;
        line-height: 80px;
        color: #0e304c;
        border: 2px solid rgba(207, 214, 219, 1);
      }
    }
    .popBtn {
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      line-height: 44px;
      text-align: center;
      padding: 34px 0;
      a {
        font-size: 34px;
        color: rgba(50, 145, 235, 1);
      }
    }
  }

  .addIssue {
    width: 250px;
    height: 76px;
    line-height: 76px;
    border-radius: 38px;
    background-color: #3291EB;
    font-size: 28px;
    color: #fff;
    font-family: PingFang-SC-Medium;
    text-align: center;
    position: fixed;
    right: 10px;
    bottom: 160px;
    .advertise-icon {
      width: 26px;
      height: 31px;
      display: inline-block;
      @include bg-icon('werbenIcon.png', 26px, 31px);
      position: relative;
      top: 5px;
    }
  }
  .content {
    .header {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 9;
      /*height: 190px;*/
      background-color: #fff;
      box-shadow: 0px 6px 12px 0px rgba(197, 210, 229, 0.27);
      .header-con {
        width: 100%;
        height: 60px;
        font-family: PingFang-SC-Medium;
        margin-top: 35px;
        position: relative;
      }
      .buySale {
        height: 60px;
        line-height: 60px;
        position: absolute;
        left: 50%;
        margin-left: -150px;
        font-size: 30px;
        border: 1px solid #CFD6DB;
        .buy, .sale {
          display: inline-block;
          width: 150px;
          height: 100%;
          text-align: center;
          color: #50565C;
        }

        .active {
          background-color: #3291EB;
          color: #fff;
        }
        .activeBgc {
          background-color: #f5174d;
          color: #fff;
        }
      }
      .recordPic {
        position: absolute;
        left: 26px;
        top: 13px;
        @include bg-icon('recordPic.png', 35px);
      }
      .filterCondition {
        position: absolute;
        right: 26px;
        top: 13px;
        @include bg-icon('filterPic.png', 35px);
      }
      .currencyType {
        .title {
          min-width: 690px;
          height: 80px;
          padding: 0 30px;
          margin-top: 48px;
          display: flex;
          display: -webkit-box;
          overflow-x: auto;
          white-space: nowrap;
          -webkit-overflow-scrolling: touch;
          li {
            width: 150px;
            text-align: center;
            font-size: 32px;
            font-family: PingFang-SC-Bold;
            font-weight: bold;
            color: rgba(74, 100, 122, 1);
            span {
              padding: 30px 0;
            }
            &.sel {
              color: rgba(50, 145, 235, 1);
              span {
                border-bottom: 4px solid #3291eb;
              }
            }
          }
        }
        /*      display: flex;
              justify-content: center;
              font-size: 32px;
              font-family: PingFang-SC-Heavy;
              font-weight: 800;
              color: #4A647A;
              margin-top: 48px;
              text-align: center;
              .currencyItem {
                padding-left: 30px;
                padding-right: 30px;
              }
              .activeBg {
                display: flex;
                justify-content: center;
                height: 4px;
                background-color: #3291EB;
                margin-top: 24px;
                margin-left: 10px;
                margin-right: 10px;
              }
              .activeColor {
                color: #3291EB;
              }*/
      }
    }
    .main {
      overflow-y: scroll;
      .tips {
        line-height: 80px;
        text-align: center;
        font-size: 26px;
        color: rgba(128, 140, 153, 1);
        padding-bottom: 60px;
        background-color: #fff;
      }
      margin-top: 230px;
      background-color: #f7f9fc;
      width: 100%;
      margin-bottom: 60px;
      padding-bottom: 10px;
      ul li {
        padding-left: 30px;
        padding-right: 30px;
        background-color: #fff;
        margin-bottom: 20px;
        padding-bottom: 50px;
        .personNews {
          padding-top: 44px;
          .headPhoto {
            display: inline-block;
            width: 40px;
            height: 40px;
            @include bg-icon('iconOnlineAvatar.png', 40px);
            border-radius: 50%;
            vertical-align: middle;
            position: relative;
            img {
              width: 100%;
              height: 100%;
              border-radius: 100%;
            }
            .online {
              width: 18px;
              height: 18px;
              background-color: #3291eb;
              border-radius: 50%;
              position: absolute;
              right: -6px;
              bottom: -6px;
            }
            .offline {
              width: 18px;
              height: 18px;
              background-color: #adb7c1;
              border-radius: 50%;
              position: absolute;
              right: -6px;
              bottom: -6px;
            }
          }
          .newsTit {
            font-size: 26px;
            font-family: PingFang-SC-Bold;
            font-weight: bold;
            color: #0E304C;
            margin: 0 10px;
          }
          .news {
            font-size: 24px;
            font-family: PingFang-SC-Bold;
            font-weight: bold;
            color: #ADB7C1;
            .middleLine {
              font-size: 20px;
              margin-right: 10px;
              position: relative;
              bottom: 3px;
            }
          }
          .alipayPic {
            display: inline-block;
            width: 35px;
            height: 35px;
            @include bg-icon('alipayPic.png', 35px);
            float: right;
            margin-left: 16px;
          }
          .bankCardPic {
            display: inline-block;
            width: 35px;
            height: 35px;
            @include bg-icon('bankCardPic.png', 35px);
            float: right;
            margin-left: 16px;
          }
        }
        .con {
          padding-top: 40px;
          margin-bottom: 20px;
          display: flex;
          .conLeft, .conRight {
            flex: 1;
            /*float: left;*/
            text-align: left;
            font-size: 24px;
            font-family: PingFang-SC-Bold;
            color: #ADB7C1;
          }
          .conRight {
            flex: 1.4;
            /*margin-left: 80px;*/
            p {
              margin-top: 6px;
            }
          }
          .price {
            font-size: 40px;
            font-family: PingFang-SC-Heavy;
            font-weight: 800;
            color: rgba(50, 145, 235, 1);
          }
        }
      }

    }
  }


</style>
