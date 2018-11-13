<template>
  <div>
    <div class="headCon">
      <span class="goBack"  @click="$router.go(-1)"></span>
      <span v-if="!type && !hua">{{bbUnit}}充值记录</span>
      <span v-if="type==1 && !hua">{{bbUnit}}提现记录</span>
      <span v-if="type==2 && !hua">{{bbUnit}}站内互转记录</span>
      <span v-if="hua==1">{{bbUnit}}划转记录</span>
    </div>
    <div class="content table" :style="{height:height}">
      <mt-loadmore
        :top-method="loadTop"
        :bottom-method="loadBottom"
        :bottom-all-loaded="allLoaded"
        ref="loadmore"
        :auto-fill="false"
        :bottomPullText="text"
        @bottom-status-change="handleBottomChange">
        <div v-if="!type" class="warp" v-for="(item,index) in tableList" :key="index" @click="goD(item)">
          <div class="left">
            <p v-text="item.TradeAmount">10.000000</p>
            <p v-text="item.CreateTime "><span>09/20 12:33</span></p>
          </div>
          <div class="right" v-text="item.ConfirmedStatusName">
            处理中
          </div>
        </div>
        <div v-if="type==5" class="warp" v-for="(item,index) in tableList" :key="index" @click="goD(item)">
          <div class="left">aa
            <p v-text="item.TradeAmount">10.000000</p>
            <p v-text="item.CreateTime "><span>09/20 12:33</span></p>
          </div>
          <div class="right" v-text="item.ConfirmedStatusName">
            处理中
          </div>
        </div>
        <div v-if="type==2" class="warp" v-for="(item,index) in tableList" :key="index" @click="goD(item)">
          <div class="left">
            <p v-text="'-'+ item.TransferVolume">10.000000</p>
            <p v-text="item.CreateTime "><span>09/20 12:33</span></p>
          </div>
          <div class="right" v-text="item.TransterStatusName">
            处理中
          </div>
        </div>
        <div v-if="type==1" class="warp" v-for="(item,index) in tableList" :key="index" @click="goD(item)">
          <div class="left">
            <p v-text="'-'+ item.SubmitAmount">10.000000</p>
            <p v-text="item.CreateTime "><span>09/20 12:33</span></p>
          </div>
          <div class="right" v-text="item.ConfirmedStatusName">
            处理中
          </div>
        </div>
        <div class="tips" v-show="moreTips">没有更多数据了...</div>
      </mt-loadmore>
    </div>
  </div>
</template>
<script type="text/babel">
  import Verification from "@/assets/js/Verification";
  import { GetUserDepositList, GetUserWithdrawList, QueryTransferAsset } from '@/service/coinTrade';
  export default {
    data(){
      return {
        bbUnit: window.localStorage.getItem('bbUnit'),
        CurrencyID: window.localStorage.getItem('CurrencyID'),
        tableList: [],
        pageIndex: 1,
        total: 0,
        allLoaded: false,
        text: "上拉加载更多",
        moreTips: false,
        height: "",
        type: '',
        hua: ''
      }

    },
    mounted(){
      this.getData ();
      this.height = document.documentElement.clientHeight - 60 + "px"; // 滚动dom高度
      this.type = this.$route.query.type;
      this.hua = this.$route.query.hua;
    },
    methods: {
      getData () {
        let self = this;
        let options = {
          pageIndex: self.pageIndex,
          currencyID: self.CurrencyID
        };
        let type = this.$route.query.type;
        let res;
        if(type=='1') {
          res = GetUserWithdrawList(options); // 调用请求传参
        } else if(type=='2') {
          res = QueryTransferAsset(options); // 调用请求传参
        } else {
          res = GetUserDepositList(options); // 调用请求传参
        }
        res.then(data => {
          if (Verification.handleData(data)) {
            self.tableList = data.Data.DataList;
            self.total = data.Data.PageCount;
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
        let options = {
          pageIndex: this.pageIndex,
          currencyId: this.CurrencyID
        };
        let type = this.$route.query.type;
        let res;
        if(type=='1') {
          res = GetUserWithdrawList(options); // 调用请求传参
        } else if(type=='2') {
          res = QueryTransferAsset(options); // 调用请求传参
        } else {
          res = GetUserDepositList(options); // 调用请求传参
        }
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
          let options = {
            pageIndex: this.pageIndex,
            currencyId: this.CurrencyID
          };
          let type = this.$route.query.type;
          let res;
          if(type=='1') {
            res = GetUserWithdrawList(options); // 调用请求传参
          } else if(type=='2') {
            res = QueryTransferAsset(options); // 调用请求传参
          } else {
            res = GetUserDepositList(options); // 调用请求传参
          }
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
      },
      goD(item) {
        window.localStorage.setItem("bbDetail", JSON.stringify(item))
        if (this.type=='1') {
          this.$router.push('/inCoinDetail?type=1')
        } else if(this.type=='2'){
          this.$router.push('/inCoinDetail?type=2')
        } else {
          this.$router.push('/inCoinDetail')
        }
      }
    },
    components: {}
  }

</script>

<style lang="scss" scoped>
  @import '~@/design/scoped';
  body {
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
  .content {
    overflow: scroll;
    .warp{
      height: 159px;
      padding-left: 30px;
      border:1px solid rgba(239,239,239,1);
      .left {
        float: left;
        height: 159px;
        width: 50%;
        p:first-child {
          font-size:36px;
          font-family:PingFang-SC-Bold;
          font-weight:bold;
          color:rgba(14,48,76,1);
          margin-top: 20px;
        }
        p:last-child {
          font-size:24px;
          font-family:PingFang-SC-Medium;
          color:rgba(128,140,153,1);
          margin-top: 20px;
        }
      }
      .right {
        float: right;
        height: 100px;
        width: 30%;
        text-align: right;
        margin-right: 20px;
        margin-top: 30px;
        font-size:30px;
        font-family:PingFang-SC-Medium;
        font-weight:500;
        color:rgba(74,100,122,1);
      }
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
      display: block;
      height: 158px;
      border-bottom: 1px solid #efefef;
      .title {
        font-size: 30px;
        font-weight: 500;
        color: rgba(14, 48, 76, 1);
        line-height: 72px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .time {
        font-size: 24px;
        font-weight: 500;
        color: rgba(128, 140, 153, 1);
        line-height: 72px;
      }
    }
  }
</style>
