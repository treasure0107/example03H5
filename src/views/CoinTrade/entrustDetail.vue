<!-- 首页 -->
<template>
  <div>
    <div class="content">
      <header>
        <span class="goBack" @click="$router.go(-1)"></span>
        <span class="test">成交明细</span>
      </header>
      <div class="entrust">
        <h3><span v-text="datas.IsBuy==1?'买入':'卖出'"></span> <span v-text="(datas.Unit || '') + '/' + (datas.ExchangeUnit || '')"></span></h3>
        <span class="sp" v-text="datas.EntrustStatusName"></span>
        <ul>
          <li>
            <div class="sed">
              <span style="text-align: left" v-text="'委托价('+ datas.ExchangeUnit + ')'"></span>
              <span style="text-align: center" v-text="'委托量('+ datas.Unit + ')'"></span>
              <span style="text-align: right">成交总额</span>
            </div>
            <div class="sed trr">
              <span style="text-align: left" v-text="datas.EntrustPrice"></span>
              <span style="text-align: center" v-text="datas.EntrustVolume "></span>
              <span style="text-align: right" v-text="datas.CompletedTotalAmount"></span>
            </div>
          </li>
          <li>
            <div class="sed">
              <span style="text-align: left" v-text="'成交均价('+ datas.ExchangeUnit + ')'"></span>
              <span style="text-align: center" v-text="'成交量('+ datas.Unit + ')'"></span>
              <span style="text-align: right">手续费</span>
            </div>
            <div class="sed trr">
              <span style="text-align: left" v-text="datas.AveragePrice"></span>
              <span style="text-align: center" v-text="datas.CompletedVolume"></span>
              <span style="text-align: right" v-text="parseFloat(allFees).toFixed(6)"></span>
            </div>
          </li>
        </ul>
      </div>
      <div class="con">
        <div class="tabl">
          <div class="table" :style="{height:height}">
            <mt-loadmore
              :top-method="loadTop"
              :bottom-method="loadBottom"
              :bottom-all-loaded="allLoaded"
              ref="loadmore"
              :auto-fill="false"
              :bottomPullText="text"
              @bottom-status-change="handleBottomChange">
              <ul v-for="(item, index) in tableList" :key="index" style="margin-top: 5px;border-bottom: 1px dashed #ddd">
                <li>
                  <span>时间</span>
                  <span v-text="item.CreateTime || ''"></span>
                </li>
                <li>
                  <span v-text="'成交价('+item.ExchangeUnit+')'"></span>
                  <span v-text="item.TradePrice?(parseFloat(item.TradePrice)).toFixed(6):''"></span>
                </li>
                <li>
                  <span v-text="'成交量('+item.Unit+')'">(ETH)</span>
                  <span v-text="item.TradeVolume?(parseFloat(item.TradeVolume)).toFixed(6):''"></span>
                </li>
                <li>
                  <span v-text="'成交总额('+item.ExchangeUnit+')'"></span>
                  <span v-text="((item.TradePrice?(parseFloat(item.TradePrice)).toFixed(6):'') * (item.TradeVolume?(parseFloat(item.TradeVolume)).toFixed(6):'')).toFixed(6)"></span>
                </li>
                <li>
                  <span v-if="datas.IsBuy" v-text="'手续费('+item.Unit+')'"></span>
                  <span v-if="!datas.IsBuy" v-text="'手续费('+item.ExchangeUnit+')'"></span>
                  <span v-if="datas.IsBuy" v-text="item.BuyTradeFees?(parseFloat(item.BuyTradeFees)).toFixed(6):''"></span>
                  <span v-if="!datas.IsBuy" v-text="item.SellTradeFees?(parseFloat(item.SellTradeFees)).toFixed(6):''"></span>
                </li>
              </ul>
              <div class="tips" v-show="moreTips">没有更多数据了...</div>
            </mt-loadmore>
          </div>
        </div>
      </div>
      <div class="cover" v-if="show==true">
        <div class="div1">
          <p class="p1">提示</p>
          <p class="p2">确定执行此操作？</p>
          <div>
            <p @click="show=false">取消</p>
            <p @click="DoCancelEntrustFn()">确认</p>
          </div>
        </div>
      </div>
    </div>
    <div id="btn" class="btn" v-if="(datas.EntrustStatus==0) || (datas.EntrustStatus==3)" @click="show=true">取消委托</div>
  </div>
</template>

<script>
import { GetEntrustRecentList, GetPageOrderListByEntrustId, DoCancelEntrust } from '@/service/coinTrade';
import {MessageBox} from 'mint-ui';
import Verification from "@/assets/js/Verification";
export default {
  name: 'index',
  data () {
    return {
      CurrentEntrustList: [],
      datas: '',
      entrustId: '',
      tableList: [],
      pageIndex: 1,
      total: 0,
      allLoaded: false,
      text: "上拉加载更多",
      moreTips: false,
      height: "",
      show:false,
      allPrice:'',
      allFees:0
    };
  },
  components: {
  },
  mounted () {
    this.datas = JSON.parse(window.localStorage.getItem('bbbDetail'));
    this.GetPageOrderListByEntrustIdFn();
    this.height = document.documentElement.clientHeight - 800 + "px"; // 滚动dom高度
  },
  methods: {
    GetPageOrderListByEntrustIdFn () {
      let self = this;
//      var CeId = window.localStorage.getItem('CeId');
      let option = {
        entrustId: self.datas.ID,
        pageIndex: self.pageIndex,
      }; // 参数
      const res = GetPageOrderListByEntrustId(option); // 调用请求传参
      res.then(data => {
        if (Verification.handleData(data)) {
          self.tableList = data.Data.DataList;
          for (var i=0;i<self.tableList.length;i++)
          {
            if (self.datas.IsBuy) {
              self.allFees += parseFloat(self.tableList[i].BuyTradeFees);
            } else {
              self.allFees += parseFloat(self.tableList[i].SellTradeFees);
            }
          }
          this.$refs.loadmore.onBottomLoaded();
          // 成功
          // console.log(data);
        }
      });
      res.catch(err => {
        // 失败
        console.log(err);
      });
    },
    DoCancelEntrustFn () {
      let self = this;
      let option = {
        id: self.datas.ID
      }; // 参数
      const res = DoCancelEntrust(option); // 调用请求传参
      res.then(data => {
        if (Verification.handleData(data)) {
          // 成功
          // console.log(data);
          self.$toast({
            className: "delect",
            message: "取消成功",
            duration: 2000
          });
          self.show=false;
          document.getElementById('btn').style.display='none';
        }
      });
      res.catch(err => {
        // 失败
        console.log(err);
      });
    },
    // 下拉刷新
    loadTop() {
      this.pageIndex = 1;
      let option = {
        entrustId: this.datas.ID,
        pageIndex: this.pageIndex,
      }; // 参数
      const res = GetPageOrderListByEntrustId(option); // 调用请求传参
      res.then(data => {
        if (Verification.handleData(data)) {
          this.tableList = data.Data.DataList;
          this.total = data.Data.PageCount;
          this.$refs.loadmore.onTopLoaded();
        }
      });
      res.catch(error => {});
    },
    // 上拉加载更多
    loadBottom() {
      if (this.pageIndex == this.total) {
        this.allLoaded = true;
        this.$refs.loadmore.onBottomLoaded();
      } else {
        this.pageIndex += 1;
        let option = {
          entrustId: this.datas.ID,
          pageIndex: this.pageIndex,
        }; // 参数
        const res = GetPageOrderListByEntrustId(option); // 调用请求传参
        res.then(data => {
          if (Verification.handleData(data)) {
            this.tableList = this.tableList.concat(data.Data.DataList);
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
    }
  },
  computed: {
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  @import '~@/design/scoped';
  .content {
    margin-bottom: 60px;
    header {
      background: #fff;
      height: 80px;
      width: 100%;
      line-height: 80px;
      text-align: center;
      font-size:34px;
      font-family:PingFang-SC-Bold;
      color:rgba(74,100,122,1);
      .goBack {
        position: absolute;
        top: 28px;
        left: 30px;
        width: 30px;
        height: 30px;
        @include bg-icon('goBack.png', 30px);
      }
    }
    .entrust {
      background: #fff;
      margin-top: 20px;
      padding-left:24px;
      padding-top: 39px;
      background: #fff;
      h3 {
        font-size: 50px;
        color:#0D2B47;
        padding-bottom: 20px;
        font-family: PingFang-SC-Bold;
      }
      .sp {
        font-size:24px;
        font-family:PingFang-SC-Medium;
        color:rgba(74,100,122,1);
        padding: 10px 20px;
        position: absolute;
        top:150px;
        right: 0;
        background:rgba(236,243,249,1);
        border-radius: 35px 0px 0px 35px;
      }
      .den {
        height: 300px;
        width: 100%;
        line-height: 200px;
        text-align: center;
        span{
          padding: 20px 60px;
          font-size: 28px;
          color: #3291EB;
          font-family:PingFang-SC-Medium;
          box-shadow: 5px 5px 10px #e1e1e1;
        }
      }
      ul {
        li {
          .fir {
            margin-top: 20px;
            display: flex;
            div:first-child {
              flex: 1;
              font-size: 24px;
              font-family: PingFang-SC-Bold;
              color: #4A647A;
            }
            div:last-child {
              flex: 1;
              text-align: right;
              font-size: 24px;
              font-family: PingFang-SC-Bold;
              color: #4A647A;
              margin-right: 20px;
            }
          }
          .sed {
            margin-top: 20px;
            display: flex;
            span {
              flex:1;
              font-size: 24px;
              color: #B5C0CB;
              margin-right: 20px;
              font-family: PingFang-SC-Medium;
            }
          }
          .trr {
            padding-bottom: 30px;
            span {
              color: #50565C;
            }
          }
        }
      }
    }
    .con {
      background: #fff;
      padding: 40px 20px;
      .tabl {
        ul {
          li {
            height: 55px;
            font-size: 28px;
            line-height: 55px;
            span {
              font-size: 28px;
              font-weight: 600;
              font-family: SFUIDisplay-Medium;
            }
            span:first-child {
              float: left;
              color:#B5C0CB;
            }
            span:last-child {
              float: right;
              margin-right: 20px;
              color:#0D2B47;
            }
          }
        }
      }
    }
    .cover {
      position: fixed;
      top:0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      .div1 {
        width: 500px;
        height: 200px;
        border-radius: 5px;
        margin:auto;
        margin-top: 75%;
        background: #fff;
        padding-top: 10px;
        .p1 {
          text-align: center;
          font-size: 30px;
          font-family: PingFang-SC-Medium;
        }
        .p2 {
          margin-top: 20px;
          text-align: center;
          font-size: 30px;
          font-family: PingFang-SC-Medium;
        }
        div {
          margin-top: 30px;
          display: flex;
          border-top: 1px solid #ddd;
          p {
            flex:1;
            text-align: center;
            height: 60px;
            line-height: 60px;
            font-family: PingFang-SC-Medium;
          }
          p:last-child {
            border-left: 1px solid #ddd;
          }
        }
      }
    }
  }
  #btn {
    width: 100%;
    height: 80px;
    background: #3291EB;
    color: #fff;
    font-family: PingFang-SC-Medium;
    font-size: 30px;
    line-height: 80px;
    text-align: center;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }
</style>
