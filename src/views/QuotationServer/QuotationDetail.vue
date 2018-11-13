<template>
    <div>
        <header-back>
            <div class="head" @click="selectCoin">
                <span>{{targetCoin}}/{{baseCoin}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span></span>
            </div>
        </header-back>
        <section>
            <div class="detail">
                <div class="left">
                    <p>{{message.CurrentPrice}}</p>
                    <p class="green" v-if="Number(message.DailyChangePerc) >= 0">+{{Number(message.DailyChangePerc).toFixed(2)}}%</p>
                    <p class="red" v-else>{{Number(message.DailyChangePerc).toFixed(2)}}%</p>
                </div>
                <div class="right">
                    <p>
                        <span>24H最低</span>
                        <span>{{message.Low}}</span>
                    </p>
                    <p>
                        <span>24H最高</span>
                        <span>{{message.High}}</span>
                    </p>
                    <p>
                        <span>24H成交</span>
                        <span>{{message.Volume}}</span>
                    </p>
                </div>
            </div>
            <kline></kline>
            <div class="select">
              <ul>
                <li :class="{sel:listType == index}" v-for="(item,index) in list" :key="index" @click="switchType(index)">{{item}}</li>
              </ul>
              <deep-chart v-show="isDeep"></deep-chart>
              <new-deal v-show="isNewDeal"></new-deal>
              <introduction v-show="isIntroduction"></introduction>
              <order-list v-show="isDeep"></order-list>
            </div>
        </section>
        <footer>
          <div @click="goTrade('buy')">买入</div>
          <div @click="goTrade('sell')">卖出</div>
        </footer>
    </div>
</template>
<script>
import wsBus from "@/assets/js/wsBus";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("pairs");
import headerBack from "@/components/headerBack";
import kline from "./KlineComp";
import newDeal from "./newDeal";
import introduction from "./introduction";
import deepChart from "./deepChart";
import orderList from "./orderList";
export default {
  components: {
    headerBack,
    kline,
    newDeal,
    introduction,
    deepChart,
    orderList
  },
  data() {
    return {
      list: ["深度", "成交", "简介"],
      listType: 0,
      isDeep: true,
      isNewDeal: false,
      isIntroduction: false,
      message: {DailyChangePerc:''},
      MarketId: ""
    };
  },
  computed: {
    ...mapState(["baseCoin", "targetCoin"])
  },
  mounted() {
    this.getCoinMarket();
    this.MarketId = localStorage.getItem('CeId')
  },
  methods: {
    ...mapMutations(["updateKlineSymbol"]),
    switchType(val) {
      this.listType = val;
      switch (val) {
        case 0:
          this.isDeep = true;
          this.isNewDeal = false;
          this.isIntroduction = false;
          break;
        case 1:
          this.isDeep = false;
          this.isNewDeal = true;
          this.isIntroduction = false;
          break;
        case 2:
          this.isDeep = false;
          this.isNewDeal = false;
          this.isIntroduction = true;
          break;
        default:
          break;
      }
    },
    getCoinMarket() {
      wsBus.$on("TradeMarketData", data => {
        this.message = data;
      });
    },
    selectCoin() {
      this.$router.push({ path: "/MarketList" });
    },
    goTrade(type) {
      let targetCoin = this.targetCoin,
        baseCoin = this.baseCoin,
        MarketId = this.MarketId;
      let CurrencyPair = { targetCoin: targetCoin, baseCoin: baseCoin };
      localStorage.setItem("CurrencyPair", JSON.stringify(CurrencyPair));
      this.updateKlineSymbol({
        baseCoin,
        targetCoin,
        MarketId
      });
      this.$router.push({ path: "/CoinTrade", query: { 'tradeType': type } });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/design/scoped";
.head {
  width: auto;
  display: inline-block !important;
  //   display: inline;
  margin: 0 auto;
  font-size: 34px;
  font-family: PingFang-SC-Heavy;
  font-weight: 800;
  color: rgba(74, 100, 122, 1);
  position: relative;
  span {
    &:nth-child(2) {
      position: absolute;
      top: 33px;
      right: 0;
      display: block;
      @include bg-icon("icon_down.png", 25px);
    }
  }
}
section {
  margin: 120px 0;
  .detail {
    height: 174px;
    padding: 0 30px 0 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      p {
        &:nth-child(1) {
          font-size: 35px;
          font-family: PingFang-SC-Heavy;
          font-weight: 800;
          color: rgba(29, 210, 93, 1);
        }
        &:nth-child(2) {
          margin-top: 30px;
          font-size: 30px;
          font-family: PingFang-SC-Heavy;
          font-weight: 800;
        }
      }
      .green {
        color: #1dd25d;
      }
      .red {
        color: #f5174d;
      }
    }
    .right {
      p {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 21px;
        &:nth-child(3) {
          margin: 0;
        }
        span {
          &:nth-child(1) {
            font-size: 24px;
            font-family: PingFang-SC-Medium;
            font-weight: 500;
            color: rgba(128, 140, 153, 1);
          }
          &:nth-child(2) {
            margin-left: 27px;
            font-size: 26px;
            font-family: PingFang-SC-Heavy;
            font-weight: 800;
            color: rgba(128, 140, 153, 1);
          }
        }
      }
    }
  }
  .select {
    width: 750px;
    ul {
      width: 750px;
      height: 100px;
      background: rgba(247, 249, 252, 1);
      display: flex;
      align-items: center;
      justify-content: space-around;
      li {
        width: 66px;
        height: 75px;
        text-align: center;
        line-height: 75px;
        font-size: 30px;
        font-family: PingFang-SC-Heavy;
        font-weight: 800;
        color: rgba(128, 135, 142, 1);
        border-bottom: 4px solid transparent;
      }
      .sel {
        color: #3291eb;
        border-bottom: 4px solid #3291eb;
      }
    }
  }
}
footer {
  width: 750px;
  height: 120px;
  background: #fff;
  box-shadow: 0px -6px 12px 0px rgba(197, 210, 229, 0.27);
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  div {
    width: 335px;
    height: 70px;
    border-radius: 4px;
    text-align: center;
    line-height: 70px;
    font-size: 28px;
    font-family: PingFang-SC-Heavy;
    font-weight: 800;
    color: #fff;
    &:nth-child(1) {
      background: #1dd25d;
    }
    &:nth-child(2) {
      background: #f5174d;
    }
  }
}
</style>
