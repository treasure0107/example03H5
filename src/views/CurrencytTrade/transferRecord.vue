<template>
  <div>
    <div class="headCon">
      <span class="goBack" @click="goBack()"></span>
      <span>划转记录</span>
    </div>
    <section>
      <div class="list"  :style="{height:height}">
        <div class="list_c">
          <div class="l-i li-f">
            <span>数量</span>
            <span>类型</span>
            <span>时间</span>
          </div>
          <div class="table">
            <mt-loadmore
              :top-method="loadTop"
              :bottom-method="loadBottom"
              :bottom-all-loaded="allLoaded"
              ref="loadmore"
              :auto-fill="false"
              :bottomPullText="text"
              @bottom-status-change="handleBottomChange">
              <div v-for="(item, index) in list" :key="index">
                <div class="l-i" v-if="item.RecordType =='MarketToOtc'">
                  <span v-if="item.CoinUnit=='APPLE'">{{toDecimal(item.Amount)}}</span>
                  <span v-else>{{item.Amount}}</span>
                  <span >转入</span>
                  <span class="span-last">{{item.CreateTime}}</span>
                </div>
                <div class="l-i" v-if="item.RecordType =='OtcToMarket'">
                  <span v-if="item.CoinUnit=='APPLE'">{{toDecimal(item.Amount)}}</span>
                  <span v-else>{{item.Amount}}</span>
                  <span >转出</span>
                  <span class="span-last">{{item.CreateTime}}</span>
                </div>
              </div>
              <div class="tips" v-show="moreTips">没有更多数据了...</div>
            </mt-loadmore>
          </div>
        </div>
      </div>
    </section>
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
    name: "transferRecord",
    data(){
      return {
        msg: "transferRecord",
        isData: false,
        list: [],
        PageIndex: 1,
        PageSize: 10,
        total: 0,
        allLoaded: false,
        text: "上拉加载更多",
        moreTips: false,
        height: "",
        CurrencyUnit:''
      }
    },
    mounted(){
      this.CurrencyUnit = this.$route.query.unit;
      this.getList();
      this.height = document.documentElement.clientHeight-60 + "px"; // 滚动dom高度
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
      // 下拉刷新
      loadTop() {
        this.PageIndex=1;
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
            RecordType: ' Transfer',
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
          res.catch(error => {});
        }
      },
      // 无更多数据
      handleBottomChange() {
        if (this.allLoaded == true) {
          this.moreTips = true;
        }
      },
      goBack(){   //返回按钮
        this.$router.back(-1);
      },
      getList() {   //获取划转记录数据
        let option = {
          Coinunit:this.CurrencyUnit,
          PageIndex: this.PageIndex,
          PageSize: this.PageSize
        }; // 参数
        const res = GetUserAssetList(option); // 调用请求传参
        res.then(data => {
          // 成功
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
  }

  .list {
    width: 100%;
    .list_c {
      .table{
        overflow-y: scroll;
      }
      .tips {
        line-height: 80px;
        text-align: center;
        font-size: 26px;
        color: rgba(128, 140, 153, 1);
      }
      .l-i {
        display: flex;
        padding: 0 30px;
        font-size: 30px;
        height: 106px;
        line-height: 106px;
        font-family: PingFang-SC-Medium;
        color: #0D2B47;
        border-bottom: 1px solid #EEF2F5;
        span {
          font-size: 28px;
          font-family: PingFang-SC-Bold;
          color: #0E304C;
        }
        span:first-child {
          text-align: left;
          flex: 3;
        }
        span:nth-child(2) {
          flex: 1;
          text-align: center;
        }
        span:last-child {
          text-align: right;
          flex: 4;
        }
        .span-last {
          color: #B5C0CB;
        }
      }
      .li-f {
        height: 80px;
        line-height: 80px;
        span {
          font-size: 28px;
          font-family: PingFang-SC-Medium;
          color: #80878E;
        }

      }
    }
  }
</style>
