<template>
  <div>
    <div class="header">
      <div class="headCon">
        <span class="goBack" @click="goBack"></span>
        <span>广告管理详情</span>
      </div>
      <div class="main">
        <div class="m-tit">
          <div><span>{{item.TradeTypeName}}</span> <span>{{item.CoinUnit}}</span></div>
          <div class="status-icon"><span>{{item.StatusName}}</span></div>
        </div>
        <div class="content">
          <div class="l-news">
            <div class="news-item">
              <p>单价(CNY)</p>
              <p>{{toDecimal(item.Price)}}</p>
            </div>
            <div class="news-item">
              <p>总量({{item.CoinUnit}})</p>
              <p v-if="item.CoinUnit=='APPLE'">{{toDecimal(item.TotalVolume)}}</p>
              <p v-else>{{item.TotalVolume}}</p>
            </div>
          </div>
          <div class="l-news">
            <div class="news-item">
              <p>剩余量({{item.CoinUnit}})</p>
              <p v-if="item.CoinUnit=='APPLE'">{{toDecimal(item.Volume)}}</p>
              <p v-else>{{item.Volume}}</p>
            </div>
            <div class="news-item">
              <p>发布时间</p>
              <p>{{item.CreateTime}}</p>
            </div>
          </div>
        </div>
      </div>
      <div style="width: 100%;height:20px;background:rgba(247,249,252,1);"></div>
      <div class="list-con">
        <div class="list-tit">
          <div>订单列表</div>
          <div class="filterSelect" @click="popupVisible=true;">
            <span v-text="OrderStatusName"></span>
            <span class="select-icon"></span>
          </div>
        </div>
        <div class="list-n" v-show="!list.length">
          <span class="blacklistIcon"></span>
          <p class="icon-t">暂无记录</p>
        </div>
      </div>
    </div>
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
                  <span class="l-tit-f">订单号：</span>
                  <span class="l-tit-f">{{item.OrderNumber}}</span>
                </div>
                <div class="l-tit-item l-tit-item-r"
                     @click="routerLink(item.OrderId)">
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
                  <p>交易金额(CNY)</p>
                  <p>{{toDecimal(item.Price * item.Volume)}}</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="tips" v-show="moreTips">没有更多数据了...</div>
      </mt-loadmore>
    </div>
    <div v-if="item.Status!='Finished'">
      <div class="btn" v-if="item.Status=='OnSale'" @click="cancel('0')">下架</div>
      <div class="btn" v-if="item.Status=='Canceled'" @click="shelf('1')">上架</div>
    </div>
    <!--弹窗-->
    <mt-popup
      v-model="popupVisible"
      position="bottom" class="popupVisible">
      <div class="popup-item" @click="orderSelect ('全部','')">全部</div>
      <div class="popup-item" @click="orderSelect ('未支付','Applying')">未支付</div>
      <div class="popup-item" @click="orderSelect ('已经支付','Paid')">已经支付</div>
      <div class="popup-item" @click="orderSelect ('交易完成','Completed')">交易完成</div>
      <div class="popup-item" @click="orderSelect ('交易取消','Cancel')">交易取消</div>
      <div class="popup-item" @click="orderSelect ('申诉中','Complaint')">申诉中</div>
      <div class="line-popup"></div>
      <div class="popup-item" @click="popupVisible=false;" style="color:#80878E;">取消</div>
    </mt-popup>
    <!--资金密码-->
    <mt-popup
      v-model="popupVisibleMoney"
      position="bottom"
      class="popupVisibleMoney">
      <div>
        <div class="popup-tit">
          <span class="pop-tit">请输入资金密码</span> <span class="cancel" @click="popupVisibleMoney = false;">取消</span>
        </div>
        <div class="moneyPassword">
          <input type="password" placeholder="请输入资金密码" class="password" v-model="safePwd">
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
  import {QueryById, OtcOrderQuery, DoCancel, DoShelf} from "@/service/CurrencytTrade";
  import countDown from '@/components/countDown';
  import {createNamespacedHelpers} from "vuex";
  import Verification from "@/assets/js/Verification";
  const {mapState, mapMutations} = createNamespacedHelpers("pairs");
  import {InfiniteScroll, Popup, Toast} from 'mint-ui';
  export default {
    data(){
      return {
        popupVisible: false,
        popupVisibleMoney: false,
        list: [],
        entrustId: '',
        item: {},
        PageIndex: 1,
        PageSize: 10,
        OrderStatusName: '全部',
        OrderStatus: '',
        safePwd: '',
        isDoShelf: '',
        total: 0,
        allLoaded: false,
        text: "上拉加载更多",
        moreTips: false,
        height: ""
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
      this.entrustId = this.$route.query.entrustId;
      this.getData();
      this.getList();
      this.height = document.documentElement.clientHeight + "px"; // 滚动dom高度
    },
    methods: {
      ...mapMutations([
        'setTheme'
      ]),
      // 下拉刷新
      loadTop() {
//        this.PageIndex = 1;
//        this.getList();
        this.$refs.loadmore.onBottomLoaded();
      },
      // 上拉加载更多
      loadBottom() {
        if (this.PageIndex == this.total) {
          this.allLoaded = true;
          this.$refs.loadmore.onBottomLoaded();
        } else {
          this.PageIndex += 1;
          let option = {
            entrustId: this.entrustId,
            PageIndex: this.PageIndex,
            PageSize: this.PageSize,
          }; // 参数
          const res = OtcOrderQuery(option); // 调用请求传参
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
      getData() {   //获取信息
        let option = {
          entrustId: this.entrustId,
        }; // 参数
        const res = QueryById(option); // 调用请求传参
        res.then(data => {
          // 成功
          if (Verification.handleData(data)) {
            this.item = data.Data;
          }
        });
        res.catch(err => {
          // 失败
          console.log(err);
        });
      },
      getList() {   //获取数据
        let option = {
          entrustId: this.entrustId,
          OrderStatus: this.OrderStatus,
          PageIndex: this.PageIndex,
          PageSize: this.PageSize,
        }; // 参数
        const res = OtcOrderQuery(option); // 调用请求传参
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
      cancel(Status){
        this.isDoShelf = Status;
        this.popupVisibleMoney = true;
      },
      shelf(Status){
        this.isDoShelf = Status;
        this.popupVisibleMoney = true;
      },
      cancelDelete(){
        let option = {
          Delete: true,
          OrderId: this.entrustId,
          PayPassword: this.safePwd
        }; // 参数
        const res = DoCancel(option); // 调用请求传参
        res.then(data => {   // 成功
          if (Verification.handleData(data)) {
            this.safePwd = '';
            this.$toast({
              message: data.Data.Msg || "下架成功！",
              duration: 600,
              position: 'top'
            });
            this.getData();
            this.getList();
          }
        });
        res.catch(err => {
          this.safePwd = '';
          // 失败
          console.log(err);
        });
      },
      doShelf(){
        let option = {
          OrderId: this.entrustId,
          PayPassword: this.safePwd
        }; // 参数
        const res = DoShelf(option); // 调用请求传参
        res.then(data => {   // 成功
          if (Verification.handleData(data)) {
            this.safePwd = '';
            this.$toast({
              message: data.Data.Msg || "上架成功！",
              duration: 600,
              position: 'top'
            });
            this.getData();
            this.getList();
          }
        });
        res.catch(err => {
          this.safePwd = '';
          // 失败
          console.log(err);
        });
      },
      sure(){
        this.popupVisibleMoney = false;
        if (!this.safePwd) {
          this.$toast({
            message: "资金密码不能为空！",
            duration: 1000,
            position: 'top'
          });
          return false;
        }
        if (this.isDoShelf == 1) {
          this.doShelf();
        } else {
          this.cancelDelete();
        }
      },
      routerLink(OrderId){
        this.$router.push({path: '/orderRecordDetails', query: {id: OrderId,entrustId:this.entrustId,type:'1'}});
      },
      orderSelect(name, OrderStatus){
        this.OrderStatusName = name;
        this.OrderStatus = OrderStatus;
        this.popupVisible = false;
        this.getList();
      },
      toDecimal(decimal){   //保留两位小数
        if (decimal) {
          return Number(decimal).toFixed(3).slice(0, -1);
        }
      },
      goBack(){
        this.$router.push({path: '/advertisingManagement'});
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

  .popupVisibleMoney {
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

  .header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 9;
    background-color: #fff;
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

  .main {
    padding-left: 26px;
    .m-tit {
      padding-top: 10px;
      display: flex;
      div:first-child {
        flex: 1;
        font-size: 50px;
        font-family: PingFang-SC-Bold;
        font-weight: 600;
        color: #0D2B47;
        text-align: left;
      }
      div:last-child {
        flex: 1;
        text-align: right;
        span {
          display: inline-block;
          width: 142px;
          height: 48px;
          line-height: 48px;
          font-size: 24px;
          font-family: PingFang-SC-Medium;
          color: #4A647A;
          background: rgba(236, 243, 249, 1);
          border-top-left-radius: 24px;
          border-bottom-left-radius: 24px;
          text-align: center;
          margin-top: 10px;
        }
      }
    }
    .content {
      padding-top: 30px;
      .l-news {
        display: flex;
        margin-top: 26px;
        .news-item {
          flex: 1;
          text-align: left;
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
      }
      .l-news:last-child {
        padding-bottom: 25px;
      }
    }
  }

  .list-con {
    padding: 30px 26px;
    .list-tit {
      display: flex;
      div {
        flex: 1;
      }
      div:first-child {
        font-size: 32px;
        font-family: PingFang-SC-Bold;
        font-weight: 600;
        color: rgba(13, 43, 71, 1);
        text-align: left;
      }
      .filterSelect {
        text-align: right;
        font-size: 28px;
        font-family: PingFang-SC-Medium;
        color: rgba(74, 100, 122, 1);
        margin-top: 3px;
        .select-icon {
          display: inline-block;
          width: 18px;
          height: 10px;
          @include bg-icon('select.png', 18px, 10px);
          position: relative;
          bottom: 3px;
        }
      }
    }
    .list-n {
      margin-top: 123px;
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
  }

  .table {
    padding-top: 530px;
    overflow-y: scroll;
    .tips {
      line-height: 80px;
      text-align: center;
      font-size: 26px;
      color: rgba(128, 140, 153, 1);
    }
    .list {
      padding: 30px 26px;
      ul {
        li {
          border-bottom: 1px solid #EEF2F5;
          .l-tit {
            display: flex;
            padding-top: 48px;
            .l-tit-item-f {
              flex: 3;
              text-align: left;
              .l-tit-f {
                font-size: 28px;
                font-family: PingFang-SC-Bold;
                font-weight: 600;
                color: #4A647A;
              }
            }
            .l-tit-item-r {
              flex: 1;
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

  .btn {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100px;
    line-height: 100px;
    text-align: center;
    font-size: 30px;
    font-family: PingFang-SC-Medium;
    color: #fff;
    background-color: #3291EB;
  }
</style>
