<template>
  <div>
    <div class="headCon">
      <span class="goBack" @click="goBack"></span>
      <span>法币账户</span>
    </div>
    <div class="news clearFl">
      <div class="news-l">
        <div class="photo"><img :src="userInfo.Avatar" alt=""></div>
        <div class="n-con">
          <p class="n-name" v-if="userInfo.NickName">{{userInfo.NickName}}</p>
          <p class="n-uid">uid {{userInfo.UserID}}</p>
        </div>
      </div>
      <div class="news-r" v-show="userInfo.IsOtcMerchant">
        <span :class="{ activeLine: isActiveLine }" @click="setOnline(true)">上线</span><span
        :class="{ activeLine: !isActiveLine }" @click="setOnline(false)">下线</span>
      </div>
    </div>
    <div class="m-o-s">
      <ul class="clearFl">
        <li>
          <router-link to="/receivingSet">
            <div>
              <span class="receivingSet icon-pic"></span>
            </div>
            <div>收款设置</div>
          </router-link>
        </li>
        <li>
          <router-link to="/currencyList">
            <div>
              <span class="fundsTransfer icon-pic"></span>
            </div>
            <div>资金划转</div>
          </router-link>
        </li>
        <li>
          <router-link to="/tradingRecord">
            <div>
              <span class="tradingRecord icon-pic"></span>
            </div>
            <div>交易记录</div>
          </router-link>
        </li>
        <li>
          <router-link to="/blacklist">
            <div>
              <span class="blacklist icon-pic"></span>
            </div>
            <div>黑名单</div>
          </router-link>
        </li>
      </ul>
      <ul class="clearFl" style="padding-top:0" v-show="userInfo.IsOtcMerchant">
        <li>
          <router-link to="/advertisingManagement">
            <div>
              <span class="advertisingManagement icon-pic"></span>
            </div>
            <div>广告管理</div>
          </router-link>
        </li>
        <li>
          <router-link to="/advertisingIssue">
            <div>
              <span class="advertisingIssue icon-pic"></span>
            </div>
            <div>发布广告</div>
          </router-link>
        </li>
      </ul>
    </div>
    <div style="width: 100%;height: 20px;background-color: #F7F9FC;"></div>
    <div class="list">
      <div class="asset-tit">
        <span>资产明细</span>
        <span class="asset-tit-b">
          <span class="checked-con" :class="{checkedActive:isCheckedActive}" @click="checkedBtn"></span>
          隐藏0余额
        </span>
      </div>
      <ul>
        <li class="li-f">
          <span>币种</span>
          <span>可用</span>
          <span>冻结</span>
        </li>
        <li v-for="(item, index) in list">
          <span>{{item.CoinInfo.CoinUnit}}</span>
          <span v-if="item.CoinInfo.CoinUnit=='APPLE'">{{toDecimal(item.OTCAsset.Available)}}</span>
          <span v-else>{{item.OTCAsset.Available}}</span>
          <span class="span-last" v-if="item.CoinInfo.CoinUnit=='APPLE'">{{toDecimal(item.OTCAsset.Frozen)}}</span>
          <span v-else>{{item.OTCAsset.Frozen}}</span>
        </li>
      </ul>
    </div>
    <!--设置昵称弹窗-->
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
  </div>
</template>
<script type="text/babel">
  import TheFooter from '@/components/footer'
  import {GetUserInfo, UpdateUserInfo, GetUserAsset, GetOnlineStatus, SetOnlineStatus} from "@/service/CurrencytTrade";
  import {createNamespacedHelpers} from "vuex";
  const {mapState, mapMutations} = createNamespacedHelpers("pairs");
  import Verification from "@/assets/js/Verification";
  import {InfiniteScroll, Popup, MessageBox, Toast} from 'mint-ui';
  export default {
    name: "accountFiat",
    data() {
      return {
        msg: "accountFiat",
        popupVisibleSet: false,   //设置昵称弹窗
        isCheckedActive: false,   //显示隐藏0余额方法
        userInfo: {},   //用户信息
        nickName: '',   //昵称
        isActiveLine: true,
        list: []   //获取用户资产数组
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
          onlineBuying: 'online buying',
          OnlineSale: 'online sale',
          registrationDate: 'registration date',
          percentageComplete: 'percentage complete',
          totalOrders: 'Total orders',
        }
      }
    },
    mounted() {
      /*this.setDefaultLanguage();*/
      this.getUserInfo();
      this.GetUserAsset();
      this.GetOnline();
    },
    methods: {
      ...mapMutations([
        'setTheme'
      ]),
      GetOnline(){   //获取商家是否在线
        let option = {}; // 参数
        const res = GetOnlineStatus(option); // 调用请求传参
        res.then(data => {   // 成功
          if (Verification.handleData(data)) {
            this.isActiveLine = data.Data
          }
        });
        res.catch(err => {
          // 失败
          console.log(err);
        });
      },
      setOnline(status){   //设置商家在线状态
        this.isActiveLine = status;
        let option = {
          isOnline: status,
        }; // 参数
        const res = SetOnlineStatus(option); // 调用请求传参
        res.then(data => {   // 成功
          if (Verification.handleData(data)) {

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
      checkedBtn(){   //隐藏0余额方法
        if (!this.isCheckedActive) {
          this.isCheckedActive = true;
          let arr = [];
          this.list.map((item) => {
            if (item.Available > 0) {
              arr.push(item)
            }
            return arr
          });
          this.list = arr;
        } else {
          this.isCheckedActive = false;
          this.GetUserAsset();
        }
      },
      goBack(){   //返回按钮
        this.$router.push({path: '/'});
      },
      cancel(){   //隐藏弹窗
        this.popupVisibleSet = false;
      },
      sureUpdateUserInfo() {   //设置昵称
        let option = {
          NickName: this.nickName,
          Avatar: this.userInfo.Avatar
        }; // 参数
        const res = UpdateUserInfo(option); // 调用请求传参
        res.then(data => {   // 成功
          if (Verification.handleData(data)) {
            setTimeout(() => {
              this.getUserInfo();
              this.popupVisibleSet = false;
            }, 1000);
          }
        });
        res.catch(err => {
          // 失败
          console.log(err);
        });
      },
      getUserInfo() {   //获取用户详情
        let option = {}; // 参数
        const res = GetUserInfo(option); // 调用请求传参
        res.then(data => {   // 成功
          if (Verification.handleData(data)) {
            this.userInfo = data.Data;
          }
        });
        res.catch(err => {   // 失败
          console.log(err);
        });
      },
      GetUserAsset() {   //获取用户资产
        let option = {}; // 参数
        const res = GetUserAsset(option); // 调用请求传参
        res.then(data => {
          // 成功
          if (Verification.handleData(data)) {
            this.list = data.Data;
          }
        });
        res.catch(err => {
          // 失败
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
  };
</script>

<style lang="scss" scoped>
  @import '~@/design/scoped';

  a:hover, a:visited, a:link, a:active {
    text-decoration: none;
    color: inherit;
  }

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

  .news {
    padding-top: 30px;
    padding-left: 30px;
    padding-right: 30px;
    background-color: #fff;
    display: flex;
    .news-l {
      flex: 1;
      text-align: left;
      .photo {
        width: 66px;
        height: 66px;
        @include bg-icon('headPic.png', 66px);
        float: left;
        img {
          width: 100%;
          height: 100%;
          border-radius: 100%;
        }
      }
      .n-con {
        float: left;
        margin-left: 20px;
        font-family: PingFang-SC-Medium;
        .n-name {
          font-size: 26px;
          color: #4A647A;
        }
        .n-uid {
          font-size: 20px;
          color: #ADB7C1;
        }
      }
    }
    .news-r {
      flex: 1;
      text-align: right;
      margin-right: 10px;
      span {
        display: inline-block;
        width: 90px;
        height: 56px;
        line-height: 56px;
        text-align: center;
        font-size: 24px;
        font-family: PingFang-SC-Medium;
        color: #50565C;
        border-radius: 4px 0 0 4px;
        border: 2px solid #CFD6DB;
      }
      span:first-child {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
      }
      span:last-child {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }
      .activeLine {
        color: #fff;
        background-color: #59A1F0;
        border: 2px solid rgba(89, 161, 240, 1);
      }
    }
  }

  .m-o-s {
    background-color: #fff;
    ul {
      padding: 30px;
      li {
        float: left;
        margin-top: 29px;
        width: 25%;
        div {
          text-align: center;
        }

        div:last-child {
          font-size: 28px;
          font-family: PingFang-SC-Medium;
          font-weight: 500;
          color: rgba(74, 100, 122, 1);
        }
        .icon-pic {
          display: inline-block;
          width: 44px;
          height: 47px;
          margin-bottom: 10px;
        }
        .receivingSet {
          @include bg-icon('receivingSetPic.png', 47px, 44px);
        }
        .fundsTransfer {
          @include bg-icon('fundsTransferPic.png', 47px, 44px);
        }
        .tradingRecord {
          @include bg-icon('assetDetailsPic.png', 47px, 44px);
        }
        .blacklist {
          @include bg-icon('blacklistPic.png', 47px, 44px);
        }
        .advertisingManagement {
          @include bg-icon('advertisingManagementPic.png', 47px, 44px);
        }
        .advertisingIssue {
           @include bg-icon('advertisingIssuePic.png', 47px, 44px);
        }
      }
    }
  }

  .list {
    width: 100%;
    .asset-tit {
      padding: 0 30px;
      height: 88px;
      line-height: 88px;
      font-size: 32px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(74, 100, 122, 1);
      .asset-tit-b {
        float: right;
        font-size: 26px;
        font-family: PingFang-SC-Medium;
        color: rgba(119, 138, 158, 1);
        .checked-con {
          display: inline-block;
          width: 24px;
          height: 24px;
          border: 2px solid #778A9E;
          margin-right: 16px;
          position: relative;
          top: 3px;
        }
        .checkedActive {
          @include bg-icon('checkedPic.png', 24px);
        }
      }
    }
    ul {
      li {
        display: flex;
        padding: 0 30px;
        font-size: 30px;
        height: 106px;
        line-height: 106px;
        font-family: PingFang-SC-Medium;
        color: #0D2B47;
        border-bottom: 1px solid #EEF2F5;
        span {
          font-size: 32px;
          font-family: PingFang-SC-Bold;
          color: #0E304C;
        }
        span:first-child {
          text-align: left;
          flex: 1;
        }
        span:nth-child(2) {
          flex: 2;
          text-align: center;
        }
        span:last-child {
          text-align: right;
          flex: 2;
        }
        .span-last {
          color: #B5C0CB;
        }
      }
      .li-f {
        span {
          font-size: 26px;
        }
        height: 70px;
        line-height: 70px;
        font-family: PingFang-SC-Medium;
        color: #B5C0CB;
        background-color: #F7FBFC;

      }
    }
  }
</style>
