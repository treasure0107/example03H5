<!-- 行情服务 -->
<template>
  <div class="content">
    <header>
      <p class="back" @click="back"></p>
      <p>选择交易币种</p>
      <router-link to="/Search"></router-link>
    </header>
    <section>
      <ul class="title">
        <li :class="{sel:activeName == 'act'+item.MarketTypeId}" @click="handleClick('act'+item.MarketTypeId)" v-for="(item,index) in MarketTypeList" :key="index"><span>{{item.MarketTypeName}}</span></li>
      </ul>
      <ul class="tableList">
          <li v-for="(item, index) in tableData" :key="index" @click="swichData(item.CeId,item.ExchangeCurrencyUnit,item.CurrencyUnit)">
              <div>
                  <p>
                    <span>{{item.CurrencyUnit}}</span>
                    <span>/ {{item.MarketTypeName}}</span>
                  </p>
                  <p>
                    <span>成交量 {{parseFloat(item.DayVolume)}}</span>
                  </p>
              </div>
              <div>{{parseFloat(item.CurrentPrice)}}</div>
              <div class="green" v-if="Number(item.PriceRate) >= 0">+{{Number(item.PriceRate).toFixed(2)}}%</div>
              <div class="red" v-else>{{Number(item.PriceRate).toFixed(2)}}%</div>
          </li>
      </ul>
    </section>
  </div>
</template>
<script>
import TheFooter from "@/components/footer";
import { getCoinMarket, getMarketTypeList } from "@/service/QuotationServer";
import Verification from "@/assets/js/Verification";
import { createNamespacedHelpers } from "vuex";
const { mapMutations } = createNamespacedHelpers("pairs");
export default {
  data() {
    return {
      coinType: 1,
      CeId: 54,
      CurrencyExchangeList: [],
      MarketTypeList: [],
      activeName: "",
      tableData: []
    };
  },
  components: {
    TheFooter
  },
  mounted() {
    // history.forward(-1);
    this.getMarket();
    this.updateMarket();
    if (!localStorage.getItem("CeId")) {
      localStorage.setItem("CeId", this.CeId);
    }
  },
  methods: {
    ...mapMutations(["updateKlineSymbol"]),
    back() {
      this.$router.go(-1);
    },
    handleClick(tab) {
      this.activeName = tab;
      this.MarketTypeId = tab.replace("act", "");
      this.tableData = this.getExchangeListByMarketType(this.MarketTypeId);
    },
    //点击某个币种
    swichData(CeId, baseCoin, targetCoin) {
      this.CeId = CeId;
      localStorage.setItem("CeId", CeId);
      let CurrencyPair = { targetCoin: targetCoin, baseCoin: baseCoin };
      localStorage.setItem("CurrencyPair", JSON.stringify(CurrencyPair));
      this.updateKlineSymbol({
        baseCoin,
        targetCoin,
        CeId
      });
      if (this.$route.query.type) {
        this.$router.push({ path: "/coinTrade" });
      } else {
        this.$router.push({ path: "/QuotationDetail" });
      }
    },
    //获取所有市场
    getMarket() {
      const res = getCoinMarket();
      res.then(data => {
        if (Verification.handleData(data)) {
          this.CurrencyExchangeList = data.Data;
          if (this.CeId) {
            this.MarketTypeId = this.getMarketTypeIdByCeId();
            this.activeName = "act" + this.MarketTypeId;
            this.tableData = this.getExchangeListByMarketType(
              this.MarketTypeId
            );
          }
          this.getMarketTypeList();
        }
      });
      res.catch(error => {});
    },
    //获取所有的市场类型
    getMarketTypeList() {
      const res = getMarketTypeList();
      res.then(data => {
        if (Verification.handleData(data)) {
          this.MarketTypeList = data.Data;
          if (!this.CeId) {
            let tempMarketTypeId = null,
              tbList = [];
            let i = 0;
            do {
              tempMarketTypeId = this.MarketTypeList[i].MarketTypeId;
              tbList = this.getExchangeListByMarketType(tempMarketTypeId);
              i++;
            } while (tbList.length == 0);
            this.CeId = tbList[0].CeId;
            this.Cename =
              tbList[0].CurrencyUnit + "_" + tbList[0].ExchangeCurrencyUnit;
          }
        }
      });
      res.catch(error => {});
    },
    //通过CeId获取市场类型id
    getMarketTypeIdByCeId() {
      for (let i = 0, len = this.CurrencyExchangeList.length; i < len; i++) {
        if (this.CurrencyExchangeList[i].CeId == this.CeId) {
          return this.CurrencyExchangeList[i].MarketTypeId;
        }
      }
    },
    // 市场类型id筛选
    getExchangeListByMarketType(marketType) {
      return this.filterByMarketType(
        this.CurrencyExchangeList,
        "MarketTypeId",
        marketType
      );
    },
    filterByMarketType(arrList, property, value) {
      let arr = [];
      arrList.forEach(function(item) {
        if (item[property] == value) {
          arr.push(item);
        }
      });
      return arr;
    },
    updateMarket() {
      // 全盘市场数据刷新
      wsBus.$on("marketData", data => {
        for (let i = 0; i < this.CurrencyExchangeList.length; i++) {
          for (let j = 0; j < data.length; j++) {
            if (this.CurrencyExchangeList[i].CeId == data[j].MarketId) {
              this.CurrencyExchangeList[i].DayVolume = data[j].Volume;
              this.CurrencyExchangeList[i].CurrentPrice = data[j].CurrentPrice;
              this.CurrencyExchangeList[i].PriceRate = data[j].DailyChangePerc;
            }
          }
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/design/scoped";
.content {
  header {
    padding: 0 30px;
    height: 111px;
    line-height: 111px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    p {
      font-size: 34px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(74, 100, 122, 1);
    }
    a {
      @include bg-icon("search.png", 33px, 34px);
    }
    .back {
      @include bg-icon("back.png", 36px, 28px);
      //   position: absolute;
      //   top: 35px;
      //   left: 29px;
    }
  }
  section {
    .title {
      min-width: 690px;
      height: 80px;
      padding: 0 30px;
      display: flex;
      display: -webkit-box;
      overflow-x: auto;
      white-space: nowrap;
      -webkit-overflow-scrolling: touch;
      li {
        width: 150px;
        text-align: center;
        font-size: 32px;
        font-family: PingFang-SC-Bold;
        font-weight: bold;
        color: rgba(74, 100, 122, 1);
        span {
          padding: 18px 0;
        }
        &.sel {
          color: rgba(50, 145, 235, 1);
          span {
            border-bottom: 4px solid #3291eb;
          }
        }
      }
    }
    .tableList {
      li {
        display: flex;
        height: 130px;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid #efefef;
        padding: 0 30px;
        div {
          &:nth-child(1) {
            width: 270px;
            p {
              &:nth-child(1) {
                span {
                  &:nth-child(1) {
                    font-size: 34px;
                    font-family: PingFang-SC-Bold;
                    font-weight: bold;
                    color: rgba(14, 48, 76, 1);
                  }
                  &:nth-child(2) {
                    font-size: 22px;
                    font-family: PingFang-SC-Medium;
                    font-weight: 500;
                    color: rgba(128, 135, 142, 1);
                  }
                }
              }
              &:nth-child(2) {
                margin-top: 18px;
                span {
                  font-size: 22px;
                  font-family: PingFang-SC-Medium;
                  font-weight: 500;
                  color: rgba(128, 135, 142, 1);
                }
              }
            }
          }
          &:nth-child(2) {
            width: 210px;
            margin-right: 30px;
            padding: 0 10px;
            text-align: right;
            font-size: 34px;
            font-family: PingFang-SC-Bold;
            font-weight: bold;
            color: rgba(14, 48, 76, 1);
          }
          &:nth-child(3) {
            width: 170px;
            height: 64px;
            text-align: center;
            line-height: 64px;
            border-radius: 4px;
            font-size: 32px;
            font-family: PingFang-SC-Bold;
            font-weight: bold;
            color: rgba(255, 255, 255, 1);
            &.red {
              background: #f5174d;
            }
            &.green {
              background: #1dd25d;
            }
          }
        }
      }
    }
  }
}
</style>

