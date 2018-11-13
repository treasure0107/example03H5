<!-- 首页 -->
<template>
  <div>
    <div class="content">
      <header>
        <span class="goBack" @click="$router.go(-1)"></span>
        <span class="test">{{targetCoin+'/'+baseCoin}}</span>
      </header>
      <div class="entrust">
        <h3>历史委托</h3>
        <ul :style="{height:height}">
          <mt-loadmore
            :top-method="loadTop"
            :bottom-method="loadBottom"
            :bottom-all-loaded="allLoaded"
            ref="loadmore"
            :auto-fill="false"
            :bottomPullText="text"
            @bottom-status-change="handleBottomChange">
            <li v-for="(item, index) in tableList" :key="index" @click="goD(item,index)">
              <div class="fir">
                <div><span v-text="item.IsBuy==1?'买入':'卖出'"></span> <span v-text="item.Unit+'/'+item.ExchangeUnit"></span></div>
                <div><span v-text="item.EntrustStatusName"></span> <span>></span></div>
              </div>
              <div class="sed">
                <span style="text-align: left" v-text="'委托价('+ item.ExchangeUnit + ')'"></span>
                <span style="text-align: center" v-text="'委托量('+ item.Unit + ')'"></span>
                <span style="text-align: right">时间</span>
              </div>
              <div class="sed trr">
                <span style="text-align: left" v-text="item.EntrustPrice">2342354234</span>
                <span style="text-align: center" v-text="item.EntrustVolume" >234234</span>
                <span style="text-align: right" v-text="item.CreateTime ">08/16 17:30</span>
              </div>
            </li>
            <div class="tips" v-show="moreTips">没有更多数据了...</div>
          </mt-loadmore>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { GetEntrustRecentList, GetEntrustList } from '@/service/coinTrade';
import Verification from "@/assets/js/Verification";
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("pairs");
export default {
  name: 'index',
  data () {
    return {
      a: true,
      b: false,
      tableList: [],
      pageIndex: 1,
      total: 0,
      allLoaded: false,
      text: "上拉加载更多",
      moreTips: false,
      height: ""
    };
  },
  components: {
  },
  computed: {
    ...mapState(["baseCoin", "targetCoin"])
  },
  mounted () {
    this.GetEntrustListFn()
    this.height = document.documentElement.clientHeight - 60 + "px"; // 滚动dom高度
  },
  methods: {
    GetEntrustListFn () {
      var CeId = window.localStorage.getItem('CeId');
      let option = {
        pageIndex: this.pageIndex,
        CeId: CeId,
      }; // 参数
      const res = GetEntrustList(option); // 调用请求传参
      res.then(data => {
        if (Verification.handleData(data)) {
          this.tableList = data.Data.DataList;
          this.total = data.Data.PageCount;
        }
        // 成功
        // console.log(data);
      });
      res.catch(err => {
        // 失败
        console.log(err);
      });
    },
    // 下拉刷新
    loadTop() {
      this.pageIndex = 1;
      var CeId = window.localStorage.getItem('CeId');
      let options = {
        pageIndex: this.pageIndex,
        CeId: CeId,
      }; // 参数
      const res = GetEntrustList(options);
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
        var CeId = window.localStorage.getItem('CeId');
        let options = {
          pageIndex: this.pageIndex,
          CeId: CeId,
        }; // 参数
        const res = GetEntrustList(options);
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
    goD(item, index) {
      window.localStorage.setItem("bbbDetail", JSON.stringify(item))
      this.$router.push('/entrustDetail')
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  @import '~@/design/scoped';
  .content {
    position: fixed;
    top:0px;
    bottom: 0;
    left: 0px;
    right: 0px;
    header {
      background: #fff;
      height: 80px;
      width: 100%;
      line-height: 80px;
      text-align: center;
      font-size:34px;
      font-family:PingFang-SC-Bold;
      color:rgba(74,100,122,1);
      .select {
        background: #fff;
        display: block;
        position: absolute;
        top: 23px;
        left: 65%;
        width: 22px;
        height: 20px;
        @include bg-icon('select.png', 25px);
      }
      .goBack {
        position: absolute;
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
        top: 15px;
        right: 20px;
        @include bg-icon('market.png', 40px);
      }
    }
    .entrust {
      height: 90%;
      overflow: auto;
      margin-top: 20px;
      padding-left:24px;
      padding-top: 39px;
      background: #fff;
      h3 {
        font-size: 32px;
        color:#0D2B47;
        padding-bottom: 20px;
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
          border-bottom:1px solid #EEF2F5;
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
  }
</style>
