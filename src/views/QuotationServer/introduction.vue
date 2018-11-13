<template>
    <div class="container">
        <head>
            <p>{{message.Unit}}</p>
            <p>{{message.CurrencyName}} ( {{message.CurrencyName_EN}} )</p>
        </head>
        <section>
            <div>
                <p>发行时间</p>
                <p>{{message.IssueDate}}</p>
            </div>
            <div>
                <p>发行总量</p>
                <p>{{message.IssueVolume}} 万</p>
            </div>
            <div>
                <p>流通总量</p>
                <p>{{message.MarketVolume}} 万</p>
            </div>
            <div>
                <p>众筹价格</p>
                <p>${{message.Price}}</p>
            </div>
            <div>
                <p>白皮书</p>
                <p>{{message.WhiteBookUrl}}</p>
            </div>
            <div>
                <p>官网</p>
                <p>{{message.WebSiteUrl}}</p>
            </div>
            <div>
                <p>区块查询</p>
                <p>{{message.BlockUrl}}</p>
            </div>
            <div class="title">
                简介
            </div>
            <div class="content">
                {{message.Comments}}
            </div>
        </section>
    </div>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
import Verification from "@/assets/js/Verification";
const { mapState } = createNamespacedHelpers("pairs");
import { getCoinIntroduction } from "@/service/QuotationServer";
export default {
  data() {
    return {
      message: {}
    };
  },
  computed: { ...mapState(["targetCoin"]) },
  mounted() {
    this.ConfigExpand();
  },
  methods: {
    ConfigExpand() {
      let options = {
        currencyUnit: this.targetCoin
      };
      const res = getCoinIntroduction(options);
      res.then(data => {
        if (Verification.handleData(data)) {
          this.message = data.Data;
        }
      });
      res.catch(error => {});
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  padding: 0 29px;
  head {
    height: 120px;
    display: flex;
    align-items: center;
    p {
      &:nth-child(1) {
        margin-right: 18px;
        font-size: 50px;
        font-family: PingFang-SC-Heavy;
        font-weight: 800;
        color: rgba(74, 100, 122, 1);
      }
      &:nth-child(2) {
        font-size: 26px;
        font-family: PingFang-SC-Medium;
        font-weight: 500;
        color: rgba(74, 100, 122, 1);
      }
    }
  }
  section {
    div {
      display: flex;
      justify-content: space-between;
      margin: 18px 0;
      p {
        &:nth-child(1) {
          width: 110px;
          font-size: 26px;
          font-family: PingFang-SC-Medium;
          font-weight: 500;
          color: rgba(173, 183, 193, 1);
        }
        &:nth-child(2) {
          width: 550px;
          text-align: right;
          font-size: 26px;
          font-family: PingFang-SC-Medium;
          font-weight: 500;
          color: rgba(74, 100, 122, 1);
        }
      }
    }
    .title {
      font-size: 34px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(173, 183, 193, 1);
    }
    .content {
      font-size: 26px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(74, 100, 122, 1);
      line-height: 39px;
    }
  }
}
</style>
