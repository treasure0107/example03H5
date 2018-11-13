<template>
  <div style="background-color: #f7f9fc;">
    <div class="headCon">
      <span class="goBack" @click="goBack"></span>
      <span class="cancel" @click="popupVisible = true;">{{$t('mask')}}</span>
    </div>
    <div class="main" v-show="isShow">
      <span class="blacklistIcon"></span>
      <p class="icon-t">您已屏蔽该商户，无法查看该商家信息。
        可点击右上角解除屏蔽</p>
    </div>
    <section v-show="!isShow">
      <div class="news clearFl">
        <div class="photo">
          <img v-if="item.Avatar" src="item.Avatar" alt="">
          <span class="online" v-if="OnlineStatus"></span>
          <span class="offline" v-if="!OnlineStatus"></span>
        </div>
        <div class="n-con">
          <p class="n-name">{{item.NickName}}</p>
          <p class="n-time">{{$t('registrationDate')}}：<span>{{item.RegisterTime}}</span></p>
        </div>
      </div>
      <div class="m-o-s">
        <ul>
          <li>
            <p>{{Number(item.CompletionRate).toFixed(2)}}%</p>
            <p>{{$t('percentageComplete')}}</p>
          </li>
          <li>
            <p>{{item.TotalOrders}}笔</p>
            <p>{{$t('totalOrders')}} </p>
          </li>
          <li>
            <p>{{item.IssuesOrders}}笔</p>
            <p>申诉</p>
          </li>
          <li>
            <p>{{item.IssuesSuccessOrders}}笔</p>
            <p>胜诉</p>
          </li>
        </ul>
        <div class="m-aut">
          <span class="phone-aut"><span>手机认证</span>
            <!--v-if="item.IsVerifyMobile"-->
            <span class="confirm-img"></span>
            <!--<span class="unverified-img" v-if="!item.IsVerifyMobile"></span>-->
          </span>
          <span class="middleLine"> |</span>
          <span class="phone-aut">
              <span>邮箱认证</span>
            <!--v-if="item.IsVerifyEmail"-->
              <span class="confirm-img"></span>
            <!--<span class="unverified-img" v-if="!item.IsVerifyEmail"></span>-->
            </span>
          <span class="middleLine"> |</span>
          <span class="phone-aut">
              <span>实名认证</span>
            <!--v-if="item.IsVerifyPrimary"-->
              <span class="confirm-img"></span>
            <!--<span class="unverified-img" v-if="!item.IsVerifyPrimary"></span>-->
            </span>
          <span class="middleLine"> |</span>
          <span class="phone-aut">
              <span>高级认证</span>
              <span class="confirm-img"></span>
            <!--<span class="unverified-img" v-if="!item.IsVerifySenior"></span>-->
            </span>
        </div>
      </div>
      <div class="list">
        <div class="l-tit" v-if="buyList.length>0">在线出售</div>
        <ul>
          <li @click="routerLink(item)" v-for="(item, index) in buyList">
            <div class="personNews">
              <span class="headPhoto">
                   <img v-if="item.Avatar" :src="item.Avatar" alt="">
              </span>
              <span class="newsTit">{{item.CoinUnit}}</span>
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
                <p><span
                  style="margin-right: 10px;">{{$t('number')}}</span><span>{{item.Volume}} {{item.CoinUnit}}</span></p>
                <p><span
                  style="margin-right: 10px;">{{$t('limit')}}</span><span>{{toDecimal(item.MinTradeAmount)}} - {{toDecimal(item.MaxTradeAmount)}} CNY</span>
                </p>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="list">
        <div class="l-tit" v-if="sellList.length>0">在线购买</div>
        <ul>
          <li @click="routerLink(item)" v-for="(item, index) in sellList">
            <div class="personNews">
              <span class="headPhoto">
                <img v-if="item.Avatar" :src="item.Avatar" alt="">
              </span>
              <span class="newsTit">{{item.CoinUnit}}</span>
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
                <p><span
                  style="margin-right: 10px;">{{$t('number')}}</span><span>{{item.Volume}} {{item.CoinUnit}}</span></p>
                <p><span
                  style="margin-right: 10px;">{{$t('limit')}}</span><span>{{toDecimal(item.MinTradeAmount)}} - {{toDecimal(item.MaxTradeAmount)}} CNY</span>
                </p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
    <!--弹窗-->
    <mt-popup
      v-model="popupVisible"
      class="popupVisible">
      <div>
        <div class="popup-tit">
          屏蔽后该用户将无法访问您发布的订单信息或与您交易，您确定要屏蔽吗?
        </div>
        <div class="popBtn">
          <div @click="popupVisible = false;">{{$t('cancel')}}</div>
          <div @click="sure">{{$t('sure')}}</div>
        </div>
      </div>
    </mt-popup>
  </div>
</template>
<script type="text/babel">
  import TheFooter from '@/components/footer'
  import {GetMetchantInfo, getEntrustQuery, BlockMerchant} from "@/service/CurrencytTrade";
  import {createNamespacedHelpers} from "vuex";
  import Verification from "@/assets/js/Verification";
  const {mapState, mapMutations} = createNamespacedHelpers("pairs");
  import {InfiniteScroll, Popup, MessageBox} from 'mint-ui';
  export default {
    name: "merchantHome",
    data() {
      return {
        msg: "merchantHome",
        isShow: false,
        isActive: true,
        confirmedStatus: true,
        popupVisible: false,
        id: '',
        item: {},
        CoinUnit: "",   //币种单位
        PaymentType: "None",   //支付类型 ['None', 'Bank', 'Alipay'],
        PageIndex: 1,
        PageSize: 100,
        buyList: [],
        sellList: [],
        OnlineStatus:false
      };
    },
    i18n: {
      messages: {
        "zh-CN": {
          lang: "中文",
          unitPrice: '单价',
          number: '数量',
          limit: '限额',
          cancel: '取消',
          sure: '确定',
          mask: '屏蔽',
          onlineBuying: '在线购买',
          OnlineSale: '在线出售',
          registrationDate: '注册时间',
          percentageComplete: '完成率',
          totalOrders: '总成单',
        },
        "en-US": {
          lang: "English",
          unitPrice: 'unitPrice',
          number: 'number',
          limit: 'limit',
          cancel: 'cancel',
          sure: 'sure',
          mask: 'mask',
          onlineBuying: 'online buying',
          OnlineSale: 'online sale',
          registrationDate: 'registration date',
          percentageComplete: 'percentage complete',
          totalOrders: 'Total orders',
        }
      }
    },
    mounted() {
      this.id = this.$route.query.id;
      this.getData();
      this.getSellList();
      this.getBuyList();
      /*this.setDefaultLanguage();*/
    },
    methods: {
      ...mapMutations([
        'setTheme'
      ]),
      toDecimal(decimal){   //保留两位小数
        if (decimal) {
          return Number(decimal).toFixed(3).slice(0, -1);
        }
      },
      goBack(){   //返回按钮
        this.$router.go(-1);
      },
      getData() {   //获取商家详情
        let option = {
          merchantId: this.id
        }; // 参数
        const res = GetMetchantInfo(option); // 调用请求传参
        res.then(data => {
          // 成功
          if (Verification.handleData(data)) {
            this.item = data.Data;
            this.OnlineStatus=this.item.OnlineStatus;
          }
        });
        res.catch(err => {
          // 失败
          console.log(err);
        });
      },
      getSellList() {   //在线购买，获取数据
        let option = {
          MechantId: this.id,
          Tradetype: "Sell",
//          CoinUnit: this.CoinUnit,
//          PaymentType: this.PaymentType,
          PageIndex: this.PageIndex,
          PageSize: this.PageSize
        }; // 参数
        const res = getEntrustQuery(option); // 调用请求传参
        res.then(data => {
          // 成功
          if (Verification.handleData(data)) {
            this.sellList = data.Data.DataList;
          }
        });
        res.catch(err => {
          // 失败
          console.log(err);
        });
      },
      getBuyList() {   //在线出售，获取数据
        let option = {
          MechantId: this.id,
          Tradetype: "Buy",
          PageIndex: this.PageIndex,
          PageSize: this.PageSize
        }; // 参数
        const res = getEntrustQuery(option); // 调用请求传参
        res.then(data => {
          // 成功
          if (Verification.handleData(data)) {
            this.buyList = data.Data.DataList;
//            console.log(this.buyList);
          }
        });
        res.catch(err => {
          // 失败
          console.log(err);
        });
      },
      sure(){   //弹窗确定按钮，屏蔽商家
        let option = {
          merchantId: this.id
        }; // 参数
        const res = BlockMerchant(option); // 调用请求传参
        res.then(data => {
          // 成功
          if (Verification.handleData(data)) {
            this.popupVisible = false;
            this.isShow = true;
            if (this.isShow) {
              this.$router.push({path: '/blacklist'});
            }
          }
        });
        res.catch(err => {
          // 失败
          console.log(err);
        });
      },
      routerLink(item){   //跳转买入/卖出详情
        if (this.OnlineStatus) {
          this.$router.push({path: '/orderDetails'});
          localStorage.setItem('currencyParams', JSON.stringify(item))
        } else {
          this.$toast({
            message: "用户不在线！",
            duration: 3000,
            position: 'top'
          });
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

  .popupVisible {
    width: 540px;
    background-color: #fff;
    text-align: center;
    .popup-tit {
      padding: 49px 76px;
      font-size: 28px;
      font-family: PingFang-SC-Medium;
      color: rgba(14, 48, 76, 1);
      line-height: 42px;
      border-bottom: 1px solid #CFD6DB;
    }
    .popBtn {
      height: 99px;
      line-height: 99px;
      font-size: 34px;
      font-family: PingFang-SC-Medium;
      display: flex;
      div {
        color: #3291EB;
        flex: 1;
      }
      div:first-child {
        border-right: 1px solid #CFD6DB;
      }

    }
  }

  .headCon {
    padding-left: 60px;
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
    .cancel {
      position: absolute;
      right: 30px;
      font-size: 26px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(80, 86, 92, 1);
    }
  }

  .main {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    .blacklistIcon {
      display: inline-block;
      width: 191px;
      height: 181px;
      @include bg-icon('iconMerchantHome.png', 285px, 243px);
    }
    .icon-t {
      margin-top: 58px;
      font-size: 30px;
      font-family: PingFang-SC-Medium;
      color: #80878E;
    }
  }

  .news {
    padding-top: 30px;
    padding-left: 30px;
    background-color: #fff;
    .photo {
      width: 80px;
      height: 80px;
      @include bg-icon('headPic.png', 80px);
      float: left;
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
        right: 3px;
        bottom: 3px;
      }
      .offline {
        width: 18px;
        height: 18px;
        background-color: #adb7c1;
        border-radius: 50%;
        position: absolute;
        right: 3px;
        bottom: 3px;
      }

    }
    .n-con {
      float: left;
      margin-left: 20px;
      font-family: PingFang-SC-Bold;
      .n-name {
        font-size: 34px;
        font-weight: bold;
        color: rgba(14, 48, 76, 1);
      }
      .n-time {
        font-size: 22px;
        margin-top: 10px;
        color: rgba(173, 183, 193, 1);
      }
    }
  }

  .m-o-s {
    background-color: #fff;
    ul {
      padding: 30px;
      display: flex;
      li {
        flex: 1;
        p {
          text-align: center;
        }
        p:first-child {
          font-size: 28px;
          height: 30px;
          line-height: 30px;
          font-family: PingFang-SC-Bold;
          font-weight: 600;
          color: rgba(128, 135, 142, 1);
        }
        p:last-child {
          font-size: 24px;
          height: 26px;
          line-height: 26px;
          margin-top: 15px;
          font-family: PingFang-SC-Bold;
          font-weight: 600;
          color: rgba(173, 183, 193, 1);
        }
      }
    }
  }

  .m-aut {
    font-size: 24px;
    padding: 0 30px 30px;
    margin-top: 30px;
    margin-bottom: 20px;
    background-color: #fff;
    font-family: PingFang-SC-Bold;
    color: rgba(173, 183, 193, 1);
    .middleLine {
      margin: 0 10px;
      color: #ADB7C1;
      vertical-align: middle;
    }
    .phone-aut {
      font-size: 24px;
      font-family: PingFang-SC-Bold;
      font-weight: 600;
      color: #ADB7C1;
      vertical-align: middle;
    }
    .confirm-img {
      display: inline-block;
      width: 24px;
      height: 24px;
      @include bg-icon('confirmedPic.png', 24px);
      vertical-align: middle;
      margin-left: 6px;
    }
    .unverified-img {
      display: inline-block;
      width: 24px;
      height: 24px;
      @include bg-icon('unverifiedPic.png', 24px);
      vertical-align: middle;
      margin-left: 6px;
    }
  }

  .list {
    background-color: #fff;
    margin-bottom: 20px;
    .l-tit {
      font-size: 30px;
      padding: 0 30px;
      height: 88px;
      line-height: 88px;
      font-family: PingFang-SC-Bold;
      color: rgba(14, 48, 76, 1);
    }
    ul li {
      padding-left: 30px;
      padding-right: 30px;
      background-color: #fff;
      margin-bottom: 20px;
      padding-bottom: 50px;
      border-bottom: 1px solid #EEF2F5;
      .personNews {
        padding-top: 44px;
        .headPhoto {
          display: inline-block;
          width: 40px;
          height: 40px;
          @include bg-icon('iconOnlineAvatar.png', 40px);
          border-radius: 50%;
          vertical-align: middle;
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
          font-size: 34px;
          font-family: PingFang-SC-Bold;
          font-weight: bold;
          color: #0E304C;
          margin: 0 10px;
          vertical-align: middle;
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
          text-align: left;
          font-size: 24px;
          font-family: PingFang-SC-Bold;
          color: #ADB7C1;
        }
        .conRight {
          flex: 1.4;
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
</style>
