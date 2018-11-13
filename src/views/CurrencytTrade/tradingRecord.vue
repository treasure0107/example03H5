<template>
  <div>
    <div class="headCon">
      <span class="goBack" @click="goBack"></span>
      <span>交易记录</span>
      <span class="filterCondition" @click="popupVisible = true;"></span>
    </div>
    <section>
      <div class="main" v-show="list.length==0">
        <span class="blacklistIcon"></span>
        <p class="icon-t">暂无记录</p>
      </div>
      <div class="list" :style="{height:height}">
          <mt-loadmore
            :top-method="loadTop"
            :bottom-method="loadBottom"
            :bottom-all-loaded="allLoaded"
            ref="loadmore"
            :auto-fill="false"
            :bottomPullText="text"
            @bottom-status-change="handleBottomChange">
            <ul>
              <li v-for="(item, index) in list">
                <div class="l-i">
                  <p class="l-i-s">{{item.RecordName }}{{item.CoinUnit}}</p>
                  <p class="l-i-t">{{item.CreateTime}}</p>
                </div>
                <div class="r-i">
                  <!--MarketToOtc-->
                  <span v-if="item.RecordType=='Buy' || item.RecordType=='MarketToOtc'">+</span>
                  <span v-if="item.RecordType=='Sell' || item.RecordType=='OtcToMarket'">-</span>
                  <span v-if="item.CoinUnit=='APPLE'">{{toDecimal(item.Amount)}}</span>
                  <span v-else>{{item.Amount}}</span>
                </div>
              </li>
            </ul>
            <div class="tips" v-show="moreTips">没有更多数据了...</div>
          </mt-loadmore>
      </div>
    </section>
    <!--筛选弹窗-->
    <mt-popup
      v-model="popupVisible"
      position="bottom" class="popupVisible">
      <div class="popup-item" @click="filteBtn('')">所有</div>
      <div class="popup-item" @click="filteBtn('Buy')">买入</div>
      <div class="popup-item" @click="filteBtn('Sell')">卖出</div>
      <div class="popup-item" @click="filteBtn('MarketToOtc')">转入</div>
      <div class="popup-item" @click="filteBtn('OtcToMarket')">转出</div>
      <div class="line-popup"></div>
      <div class="popup-item" @click="filteBtn('')">取消</div>
    </mt-popup>
  </div>
</template>
<script type="text/babel">
  import TheFooter from '@/components/footer'
  import {GetUserAssetList} from "@/service/CurrencytTrade";
  import {createNamespacedHelpers} from "vuex";
  import Verification from "@/assets/js/Verification";
  const {mapState, mapMutations} = createNamespacedHelpers("pairs");
  import {Toast, InfiniteScroll} from 'mint-ui';
  export default {
    name: "tradingRecord",
    data(){
      return {
        msg: "tradingRecord",
        list: [],
        popupVisible: false,
        isShow: false,
        flag: true,
        PageIndex: 1,
        PageSize: 10,
        StatusItem: '',
        total: 0,
        allLoaded: false,
        text: "上拉加载更多",
        moreTips: false,
        height: ""
      }

    },
    mounted(){
      this.getData('');
      this.height = document.documentElement.clientHeight + "px"; // 滚动dom高度
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
      toDecimal(decimal){   //保留两位小数
        if (decimal) {
          return Number(decimal).toFixed(3).slice(0, -1);
        }
      },
      // 下拉刷新
      loadTop() {
        this.PageIndex=1;
        this.getData('');
      },
      // 上拉加载更多
      loadBottom() {
        if (this.PageIndex == this.total) {
          this.allLoaded = true;
          this.$refs.loadmore.onBottomLoaded();
        } else {
          this.PageIndex += 1;
          let option = {
            Status: this.StatusItem,
            Coinunit: "",
            PageIndex: this.PageIndex,
            PageSize: this.PageSize
          }; // 参数
          const res = GetUserAssetList(option); // 调用请求传参
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
      getData(Status) {   //获取交易记录
        let option = {
          Status: Status,
          Coinunit: "",
          PageIndex: this.PageIndex,
          PageSize: this.PageSize
        }; // 参数
        const res = GetUserAssetList(option); // 调用请求传参
        res.then(data => {
          // 成功
          if (Verification.handleData(data)) {
            this.list = data.Data.DataList;
            this.$refs.loadmore.onTopLoaded();
          }
        });
        res.catch(err => {
          // 失败
          console.log(err);
        });
      },
      goBack(){   //返回按钮
        this.$router.push({path: '/accountFiat'});
      },
      filteBtn(Status){   //筛选方法
        this.StatusItem = Status;
        this.popupVisible = false;
        this.getData(Status);
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
    }
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
    .filterCondition {
      position: absolute;
      right: 26px;
      top: 28px;
      @include bg-icon('filterConditionPic.png', 35px);
    }
  }

  .popupVisible {
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
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    .blacklistIcon {
      display: inline-block;
      width: 191px;
      height: 181px;
      @include bg-icon('blacklistIconPic.png', 181px, 191px);
    }
    .icon-t {
      margin-top: 58px;
      font-size: 30px;
      font-family: PingFang-SC-Medium;
      color: #80878E;
    }
  }

  .list {
    padding: 0 30px;
    overflow-y: scroll;
    .tips {
      line-height: 80px;
      text-align: center;
      font-size: 26px;
      color: rgba(128, 140, 153, 1);
    }
    ul {
      li {
        display: flex;
        margin-top: 46px;
        padding-bottom: 40px;
        border-bottom: 1px solid #EEF2F5;
        .l-i {
          flex: 1;
          text-align: left;
          .l-i-s {
            font-size: 34px;
            font-family: PingFang-SC-Bold;
            font-weight: 600;
            color: rgba(14, 48, 76, 1);
          }
          .l-i-t {
            font-size: 24px;
            font-family: PingFang-SC-Medium;
            color: rgba(128, 140, 153, 1);
            margin-top: 20px;
          }
        }
        .r-i {
          flex: 1;
          text-align: right;
          font-size: 42px;
          font-family: PingFang-SC-Medium;
          font-weight: 500;
          color: rgba(50, 145, 235, 1);
          span {
            padding-top: 30px;
          }
        }
      }

    }
  }
</style>
