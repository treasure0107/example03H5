<template>
    <div>
        <header>
          <span>Apple行情</span>
          <span>最新价</span>
          <span>涨跌幅</span>
        </header>
        <section>
            <ul>
                <li v-for="(item,index) in marketList" :key="index" @click="swichData(item.CeId,item.ExchangeCurrencyUnit,item.CurrencyUnit)">
                    <p>
                        <span>{{item.CurrencyUnit}}</span>
                        <span>/ {{item.ExchangeCurrencyUnit}}</span>
                    </p>
                    <p>{{parseFloat(item.CurrentPrice)}}</p>
                    <p class="green" v-if="item.PriceRate >= 0">+{{Number(item.PriceRate).toFixed(2)}}%</p>
                    <p class="red" v-else>{{Number(item.PriceRate).toFixed(2)}}%</p>
                </li>
            </ul>
        </section>
    </div>
</template>
<script>
import wsBus from "@/assets/js/wsBus";
import Verification from "@/assets/js/Verification";
import { createNamespacedHelpers } from "vuex";
const { mapMutations } = createNamespacedHelpers("pairs");
import { getCoinMarket } from "@/service/QuotationServer";
export default {
  name: "quotation",
  data() {
    return {
      marketList: []
    };
  },
  mounted() {
    this.getMarket();
    this.updateMarket();
  },
  methods: {
    ...mapMutations(["updateKlineSymbol", "setLoading"]),
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
      this.$router.push({ path: "/QuotationDetail" });
    },
    //获取apple行情市场
    getMarket() {
      const res = getCoinMarket();
      res.then(data => {
        if (Verification.handleData(data)) {
          for (let i = 0; i < data.Data.length; i++) {
            if (data.Data[i].ExchangeCurrencyUnit == "APPLE") {
              this.marketList.push(data.Data[i]);
            }
          }
        }
      });
      res.catch(error => {});
    },
    // 更新apple行情
    updateMarket() {
      wsBus.$on("marketData", data => {
        for (let i = 0; i < this.marketList.length; i++) {
          for (let j = 0; j < data.length; j++) {
            if (this.marketList[i].CeId == data[j].MarketId) {
              this.marketList[i].CurrentPrice = data[j].CurrentPrice;
              this.marketList[i].PriceRate = data[j].DailyChangePerc;
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
header {
  height: 90px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #efefef;
  span {
    font-family: PingFang-SC-Bold;
    color: rgba(14, 48, 76, 1);
    line-height: 90px;
    font-size: 32px;
    font-weight: bold;
  }
}
section {
  ul {
    li {
      display: flex;
      height: 130px;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #efefef;
      p {
        &:nth-child(1) {
          width: 220px;
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
          width: 210px;
          margin-right: 30px;
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
</style>
