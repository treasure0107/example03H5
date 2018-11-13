<template>
  <div>
    <div class="headCon">
      <span class="goBack" @click="$router.go(-1)"></span>
      <span>交易记录</span>
      <span class="market" @click="cenFn()"></span>
    </div>
    <div class="under" v-if="isShow" @click="cenFn()">
      <div @click.stop="cenFn2()" class="blok">
        <div class="white"></div>
        <div class="fir">
          <span>币种</span>
          <div>
            <select v-model="CurrencyID" class="sle">
              <option value="" selected>所有</option>
              <option v-for="(item,index) in category" :key="index" :value="item.CurrencyID">{{ item.name }}</option>
            </select>
          </div>
        </div>
        <div class="white"></div>
        <div class="fir">
          <span>类型</span>
          <div>
            <select v-model="RecordTypeId" class="sle">
              <option value="" selected>所有</option>
              <option v-for="(item,index) in category2" :key="index"  :value="item.id">{{ item.name }}</option>
            </select>
          </div>
        </div>
        <div class="bott">
          <div class="div1" @click="subbFn()">重置</div>
          <div @click="getData2 ()">确定</div>
        </div>
      </div>
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
        <div class="warp" v-for="(item,index) in tableList" :key="index" @click="goD(item)">
          <div class="left">
            <p v-text="item.RecordTypeName">10.000000</p>
            <p v-text="item.CreateTime"><span>09/20 12:33</span></p>
          </div>
          <div class="right" v-text="item.InOutType==1?'+'+item.ChangeValue:'-'+item.ChangeValue">
          </div>
        </div>
        <div class="tips" v-show="moreTips">没有更多数据了...</div>
      </mt-loadmore>
    </div>
    <!--<div class="main" >
      <span class="blacklistIcon"></span>
      <p class="icon-t">暂无记录</p>
    </div>-->
  </div>
</template>
<script type="text/babel">
  import Verification from "@/assets/js/Verification";
  import { GetUserAssetRecordList, GetUserAssetList } from '@/service/coinTrade';
  export default {
    data(){
      return {
        isShow: false,
        flag: true,
        tableList: [],
        pageIndex: 1,
        total: 0,
        allLoaded: false,
        text: "上拉加载更多",
        moreTips: false,
        RecordTypeId: '',
        CurrencyID: '',
        height: '',
        category: [],
        category2: [{
          name: '充值',
          id: 1
        },{
          name: '提现',
          id: 2
        },{
          name: '买入',
          id: 3
        },{
          name: '卖出',
          id: 4
        },{
          name: '资金划转',
          id: 6
        },{
          name: '站内互转',
          id: 7
        },]
      }

    },
    mounted(){
      this.getData();
      this.height = document.documentElement.clientHeight - 60 + "px"; // 滚动dom高度
      this.getUnit ();
    },
    methods: {
      cenFn () {
        if( this.flag ){
          this.isShow=true;
          this.flag = false;
        } else {
          this.isShow=false;
          this.flag = true;
        }
      },
      cenFn2 () {
      },
      subbFn () {
        this.RecordTypeId = '';
        this.CurrencyID = '';
      },
      getData2() {
        this.getData();
        this.isShow=false;
        this.flag = true;
      },
      getData () {
        let self = this;
        let options = {
          pageIndex: self.pageIndex,
          currencyID: self.CurrencyID,
          RecordTypeId: self.RecordTypeId,
        };
        let res = GetUserAssetRecordList(options); // 调用请求传参
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
      getUnit () {
        let self = this;
        let options = {};
        let res = GetUserAssetList(options); // 调用请求传参
        res.then(data => {
          if (Verification.handleData(data)) {
            for (var i=0;i<data.Data.length;i++)
            {
              self.category.push({
                name:data.Data[i].Unit,
                CurrencyID:data.Data[i].CurrencyID
              })
            }
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
          currencyID: this.CurrencyID,
          RecordTypeId: this.RecordTypeId,
        };
        let res = GetUserAssetRecordList(options); // 调用请求传参
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
            currencyID: this.CurrencyID,
            RecordTypeId: this.RecordTypeId,
          };
          let res = GetUserAssetRecordList(options); // 调用请求传参
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
      goD(obj) {

        window.localStorage.setItem("bbDetail", JSON.stringify(obj))
        this.$router.push('/inCoinDetail?type=5')
      }
    },
    components: {}
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
      display: block;
      top: 28px;
      left: 30px;
      width: 30px;
      height: 30px;
      @include bg-icon('goBack.png', 30px);
    }
    .market {
      background: #fff;
      display: block;
      position: absolute;
      top:25px;
      right: 20px;
      @include bg-icon('ld.png', 30px);
      width: 40px;
      height: 40px;
    }
  }
  .under {
    position: fixed;
    top:90px;
    left:0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    .blok {
      position: relative;
      width: 100%;
      height: 426px;
      background: #fff;
      padding-left: 30px;
      .fir {
        height: 80px;
        span{
          height: 80px;
          line-height: 80px;
          text-align: center;
          display: inline-block;
          font-size:30px;
          font-family:PingFang-SC-Medium;
          color:rgba(128,135,142,1);
          float: left;
        }
        div {
          margin-left: 40px;
          /*border:1px solid rgba(214,219,228,1);*/
          float: left;
          height: 80px;
          width: 75%;
          position: relative;
          .sle{
            width: 100%;
            height: 75px;
          }
          .bz {
            margin: 2px 27px;
            width: 70%;
            height: 75px;
            font-size: 30px;
            text-align: left;
            font-family:PingFang-SC-Bold;
            color:rgba(14,48,76,1);
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
      }
    }
    .white {
      height: 56px;
    }
    .bott {
      width: 100%;
      height: 104px;
      display: flex;
      position: absolute;
      bottom: 0;
      left: 0;
      div {
        flex: 1;
        height: 104px;
        line-height: 104px;
        text-align: center;
        font-size:30px;
        font-family:PingFang-SC-Medium;
        color:rgba(255,255,255,1);
        background: #3291EB;
      }
      .div1 {
        color:#4A647A;
        background: #fff;
      }
    }
  }
  .content {
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
