<template>
  <!--订单记录-->
  <div>
    <div class="header">
      <div class="headCon">
        <span class="goBack" @click="goBack"></span>
        <span>订单记录</span>
        <span class="filterCondition" @click="filterDialog()"></span>
      </div>
    </div>
    <div class="under" v-if="isPopupShow" @click="filterDialog()">
      <div @click.stop="filterStop()" class="blok">
        <!--   <div class="fir">
             <div class="f-t">币种</div>
             <div class="f-i">
               <a href="javascript:void(0);" class="active">全部</a>
               <a href="javascript:void(0);">APPLE</a>
               <a href="javascript:void(0);">APPLE</a>
               <a href="javascript:void(0);">APPLE</a>
             </div>
           </div>-->
        <div class="fir">
          <div class="f-t">交易类型</div>
          <div class="f-i">
            <a :class="{active:activeType == 0}" @click="tradeType(0,'')" href="javascript:void(0);">全部</a>
            <a :class="{active:activeType == 1}" @click="tradeType(1,'Buy')" href="javascript:void(0);">买入</a>
            <a :class="{active:activeType == 2}" @click="tradeType(2,'Sell')" href="javascript:void(0);">卖出</a>
          </div>
        </div>
        <div class="fir">
          <div class="f-t">订单状态</div>
          <div class="f-i">
            <a :class="{active:coinType == 0}" @click="currency(0,'')" href="javascript:void(0);">全部</a>
            <a :class="{active:coinType == 1}" @click="currency(1,'Applying')" href="javascript:void(0);">未支付</a>
            <a :class="{active:coinType == 2}" @click="currency(2,'Paid')" href="javascript:void(0);">已经支付</a>
            <a :class="{active:coinType == 3}" @click="currency(3,'Completed')" href="javascript:void(0);">交易完成</a>
            <a :class="{active:coinType == 4}" @click="currency(4,'Cancel')" href="javascript:void(0);">交易取消</a>
            <a :class="{active:coinType == 5}" @click="currency(5,'Complaint')" href="javascript:void(0);">申诉中</a>
          </div>
        </div>
        <div class="b-t">
          <div @click="resetBtn">重置</div>
          <div @click="filterBtn">确定</div>
        </div>
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
                    <span class="l-tit-f" v-if="item.Tradetype=='Sell'"
                          style="color:#F5174D;">{{item.TradeTypeName}}</span>
                    <span class="l-tit-f" v-else>{{item.TradeTypeName}}</span>
                    <span class="l-tit-s">{{item.CoinUnit}}</span>
                  </div>
                  <div class="l-tit-item l-tit-item-r"
                       @click="routerLink(item.Tradetype,item.OrderStatus,item.OrderId )">
                    <span class="l-tit-t">{{item.OrderStatusName}} <span> &gt; </span></span>
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
                    <p>交易额(CNY)</p>
                    <p>{{toDecimal(item.Price * item.Volume)}}</p>
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
  import {QueryOrder} from "@/service/CurrencytTrade";
  import {createNamespacedHelpers} from "vuex";
  import Verification from "@/assets/js/Verification";
  const {mapState, mapMutations} = createNamespacedHelpers("pairs");
  import {InfiniteScroll, Popup, Header} from 'mint-ui';

  export default {
    name: "orderRecord",
    data() {
      return {
        msg: "orderRecord",
        isActive: true,
        isPopupShow: false,
        flag: true,
        list: [],
        PageIndex: 1,
        PageSize: 10,
        activeType: 0,
        coinType: 0,
        Tradetype: '',
        OrderStatus: '',
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
            OrderStatus: this.OrderStatus,
            Tradetype: this.Tradetype,
            PageIndex: this.PageIndex,
            PageSize: this.PageSize
          }; // 参数
          const res = QueryOrder(option); // 调用请求传参
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
      tradeType(type, tradeType){   //交易类型筛选
        this.activeType = type;
        this.Tradetype = tradeType;
      },
      currency(type, OrderStatus){   //订单状态筛选
        this.coinType = type;
        this.OrderStatus = OrderStatus;
      },
      filterBtn(){   //确定（筛选）
        this.getList();
      },
      resetBtn(){   //充值按钮
        this.activeType = 0;
        this.coinType = 0;
        this.Tradetype = '';
        this.OrderStatus = '';
//        this.getList();
//        this.isPopupShow = false;
      },
      filterDialog() {   //筛选弹窗显示与隐藏
        if (this.flag) {
          this.isPopupShow = true;
          this.flag = false;
        } else {
          this.isPopupShow = false;
          this.flag = true;
        }
      },
      filterStop(){
//        this.isPopupShow = false;
      },
      toDecimal(decimal){   //保留两位小数
        if (decimal) {
          return Number(decimal).toFixed(3).slice(0, -1);
        }
      },
      goBack(){   //返回按钮
        this.$router.push({path: '/CurrencytTrade'});
      },
      routerLink(Tradetype, OrderStatus, OrderId){   //跳转到订单详情
        this.$router.push({path: '/orderRecordDetails', query: {id: OrderId, type: '3'}});
      },
      getList() {   //获取订单列表数据
//        交易中Applying, 交易完成Completed, 交易取消Cancel, 交易失败Failure, 申诉中 Complaint, 已经支付
        let option = {
          OrderStatus: this.OrderStatus,    //Applying   Paid  Completed Cancel  Complaint
          Tradetype: this.Tradetype,
          PageIndex: this.PageIndex,
          PageSize: this.PageSize
        }; // 参数
        const res = QueryOrder(option); // 调用请求传参
        res.then(data => {
          // 成功
          if (Verification.handleData(data)) {
            this.list = data.Data.DataList;
            this.isPopupShow = false;
            this.total = data.Data.PageCount;
            this.$refs.loadmore.onTopLoaded();
            console.log(this.list);
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
                /*color:#F5174D;*/
              }
              .l-tit-s {
                font-size: 34px;
                font-family: PingFang-SC-Bold;
                color: rgba(74, 100, 122, 1);
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
              flex: 1;
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
              text-align: right;
            }
          }
        }
      }
    }
  }

  .under {
    position: fixed;
    top: 90px;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 3000;
    .blok {
      position: relative;
      width: 100%;
      background-color: #fff;

      .fir {
        padding-left: 30px;
        font-size: 26px;
        font-family: PingFang-SC-Medium;
        .f-t {
          font-size: 30px;
          color: #80878E;
          padding-top: 40px;
        }
        .f-i {
          a {
            display: inline-block;
            width: 212px;
            height: 56px;
            line-height: 56px;
            text-align: center;
            color: #4A647A;
            margin-right: 20px;
            margin-top: 29px;
          }
          .active {
            color: #fff;
            background-color: #3291EB;
          }
        }
      }
      .b-t {
        display: flex;
        height: 104px;
        line-height: 104px;
        margin-top: 46px;
        border-top: 1px solid #EFEFEF;
        font-size: 30px;
        font-family: PingFang-SC-Medium;
        div {
          flex: 1;
          text-align: center;
        }
        div:last-child {
          background-color: #3291EB;
          color: #fff;
        }
      }
      /*   .fir {
           height: 80px;
           span {
             height: 80px;
             line-height: 80px;
             text-align: center;
             display: inline-block;
             font-size: 30px;
             font-family: PingFang-SC-Medium;
             color: rgba(128, 135, 142, 1);
             float: left;
           }
           div {
             margin-left: 40px;
             border: 1px solid rgba(214, 219, 228, 1);
             float: left;
             height: 80px;
             width: 75%;
             position: relative;
             .bz {
               margin: 2px 27px;
               width: 70%;
               height: 75px;
               font-size: 30px;
               text-align: left;
               font-family: PingFang-SC-Bold;
               color: rgba(14, 48, 76, 1);
             }
             .bon {
               position: absolute;
               top: 35px;
               right: 30px;
               display: inline-block;
               width: 20px;
               height: 15px;
               @include bg-icon('xl.png', 20px, 15px);
             }
           }
         }*/
    }
    /*.bott {
      width: 100%;
      height: 100px;
      display: flex;
      position: absolute;
      bottom: 0;
      left: 0;
      div {
        flex: 1;
        height: 104px;
        line-height: 104px;
        text-align: center;
        font-size: 30px;
        font-family: PingFang-SC-Medium;
        color: rgba(255, 255, 255, 1);
        background: #3291EB;
      }
      .div1 {
        color: #4A647A;
        background: #fff;
      }
    }*/
  }
</style>
