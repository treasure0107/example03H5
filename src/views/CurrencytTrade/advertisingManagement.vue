<template>
  <!--广告列表-->
  <div>
    <div class="header">
      <div class="headCon">
        <span class="goBack" @click="goBack"></span>
        <span>广告列表</span>
      </div>
    </div>
    <section>
      <div class="table" :style="{height:height}">
        <mt-loadmore
          :top-method="loadTop"
          :bottom-method="loadBottom"
          :bottom-all-loaded="allLoaded"
          ref="loadmore"
          :auto-fill="false"
          :bottomPullText="text"
          @bottom-status-change="handleBottomChange">
          <div class="list">
            <ul>
              <li v-for="(item, index) in list">
                <div class="l-tit">
                  <div class="l-tit-item l-tit-item-f">
                    <span class="l-tit-f" v-if="item.TradeType=='Sell'"
                          style="color:#F5174D;">{{item.TradeTypeName}}</span>
                    <span class="l-tit-f" v-else>{{item.TradeTypeName}}</span>
                    <span class="l-tit-s">{{item.CoinUnit}}</span>
                  </div>
                  <div class="l-tit-item l-tit-item-r"
                       @click="routerLink(item.EntrustId)">
                    <span class="l-tit-t">{{item.StatusName}}<span> &gt; </span></span>
                  </div>
                </div>
                <div class="l-news">
                  <div class="news-item">
                    <p>单价(CNY)</p>
                    <p>{{toDecimal(item.Price)}}</p>
                  </div>
                  <div class="news-item">
                    <p>数量({{item.CoinUnit}})</p>
                    <p v-if="item.CoinUnit=='APPLE'">{{toDecimal(item.Volume)}}</p>
                    <p v-else>{{item.Volume}}</p>
                  </div>
                  <div class="news-item">
                    <p>限额(CNY)</p>
                    <p>{{toDecimal(item.MinTradeAmount)}}-{{toDecimal(item.MaxTradeAmount)}}</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="tips" v-show="moreTips">没有更多数据了...</div>
        </mt-loadmore>
      </div>
    </section>
  </div>
</template>
<script>
  import TheFooter from '@/components/footer'
  import {QueryOrder, QueryEntrust} from "@/service/CurrencytTrade";
  import {createNamespacedHelpers} from "vuex";
  import Verification from "@/assets/js/Verification";
  const {mapState, mapMutations} = createNamespacedHelpers("pairs");
  import {InfiniteScroll, Popup, Header} from 'mint-ui';

  export default {
    name: "advertisingManagement",
    data() {
      return {
        msg: "advertisingManagement",
        list: [],
        PageIndex: 1,
        PageSize: 100,
        activeType: 0,
        Tradetype: '',
        CoinUnit: '',
        total: 0,
        allLoaded: false,
        text: "上拉加载更多",
        moreTips: false,
        height: ""
      };
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
    mounted() {
      this.getList();
      this.height = document.documentElement.clientHeight + "px"; // 滚动dom高度
      /*   this.setDefaultLanguage();*/
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
            TradeType: "",
            EntrustStatus: "",
            PageIndex: this.PageIndex,
            PageSize: this.PageSize
          }; // 参数
          const res = QueryEntrust(option); // 调用请求传参
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
      toDecimal(decimal){   //保留两位小数
        if (decimal) {
          return Number(decimal).toFixed(3).slice(0, -1);
        }
      },
      goBack(){   //返回按钮
//        this.$router.go(-1);
        this.$router.push({path: '/accountFiat'});
      },
      routerLink(OrderId){   //跳转到订单详情
        this.$router.push({path: '/advertisingDetails', query: {entrustId: OrderId}});
      },
      getList() {   //获取列表数据
        let option = {
          TradeType: "",
          EntrustStatus: "",
          PageIndex: this.PageIndex,
          PageSize: this.PageSize
        }; // 参数
        const res = QueryEntrust(option); // 调用请求传参
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
  };
</script>

<style lang="scss" scoped>
  @import '~@/design/scoped';

  .header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 9;
    background-color: #fff;
    box-shadow: 0px 6px 12px 0px rgba(197, 210, 229, 0.27);
    .headCon {
      height: 88px;
      line-height: 88px;
      position: relative;
      text-align: center;
      font-size: 34px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(14, 48, 76, 1);

      .goBack {
        position: absolute;
        top: 29px;
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
  }

  .popupHeadCon {
    padding-left: 60px;
    height: 88px;
    line-height: 88px;
    position: relative;
    text-align: center;
    font-size: 34px;
    font-family: PingFang-SC-Medium;
    color: #0E304C;
    border-bottom: 1px solid #ccc;
    .goBack {
      position: absolute;
      top: 29px;
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

  .table {
    overflow-y: scroll;
    .tips {
      line-height: 80px;
      text-align: center;
      font-size: 26px;
      color: rgba(128, 140, 153, 1);
    }
    .list {
      margin-top: 90px;
      ul {
        li {
          padding: 0 30px;
          border-bottom: 1px solid #EEF2F5;
          .l-tit {
            display: flex;
            padding-top: 48px;
            .l-tit-item {
              flex: 1;
            }
            .l-tit-item-f {
              text-align: left;
              .l-tit-f {
                font-size: 30px;
                margin-right: 25px;
                font-family: PingFang-SC-Bold;
                color: #1DD25D;
                /*font-weight: 600;*/
              }
              .l-tit-s {
                font-size: 34px;
                font-family: PingFang-SC-Bold;
                color: rgba(74, 100, 122, 1);
                /*font-weight: 600;*/
              }
            }
            .l-tit-item-r {
              text-align: right;
              .l-tit-t {
                font-size: 26px;
                font-family: PingFang-SC-Medium;
                color: rgba(74, 100, 122, 1);
                span {
                  font-size: 29px;
                }
              }
            }
          }
          .l-news {
            display: flex;
            padding-top: 39px;
            padding-bottom: 46px;
            .news-item {
              flex: 2;
              text-align: center;
              font-size: 24px;
              font-family: PingFang-SC-Medium;
              p:first-child {
                color: #B5C0CB;
                margin-bottom: 25px;
              }
              p:last-child {
                color: #50565C;
              }
            }
            .news-item:first-child {
              text-align: left;
            }
            .news-item:last-child {
              flex: 3;
              text-align: right;
            }
          }
        }
      }
    }
  }
</style>
