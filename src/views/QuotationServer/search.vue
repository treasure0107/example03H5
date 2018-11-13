<template>
    <div>
        <header>
            <p class="coin"></p>
            <input type="text" style="ime-mode:disabled" v-model="keyword" placeholder="请输入币种" @focus="isShow = false" @blur="isShow = true" @input="keywordInput">
            <router-link class="back" to="/QuotationServer">取消</router-link>
        </header>
        <section>
            <ul v-show="!isShow">
                <li v-for="(item,index) in searchList" :key="index" @click="search(item)">{{item.targetCoin}} / {{item.baseCoin}}</li>
            </ul>
            <div class="history" v-show="isShow && historyArr.length != 0">
                <div>
                    <p>搜索历史</p>
                    <p @click="delectHistory"></p>
                </div>
                <ul>
                    <li v-for="(item,index) in historyArr" :key="index" @click="search(item)">{{item.targetCoin}} / {{item.baseCoin}}</li>
                </ul>
            </div>
        </section>
    </div>
</template>
<script>
import { getCoinlist } from "@/service/QuotationServer";
import { createNamespacedHelpers } from "vuex";
const { mapMutations } = createNamespacedHelpers("pairs");
import Verification from "@/assets/js/Verification";
export default {
  data() {
    return {
      isShow: true,
      historyArr: [],
      searchArr: [],
      searchList: [],
      keyword: ""
    };
  },
  created() {
    this.getHistory();
  },
  mounted() {
    this.getSearch();
  },
  methods: {
    ...mapMutations(["updateKlineSymbol"]),
    getHistory() {
      // 获取历史记录
      if (localStorage.getItem("history")) {
        this.historyArr = JSON.parse(localStorage.getItem("history"));
      }
    },
    delectHistory() {
      // 删除历史记录
      localStorage.removeItem("history");
      this.historyArr = [];
      this.$toast({
        className: "delect",
        message: "清除历史记录成功",
        duration: 2000
      });
    },
    getSearch() {
      // 获取交易对
      const res = getCoinlist();
      res.then(data => {
        if (Verification.handleData(data)) {
          for (let i = 0; i < data.Data.length; i++) {
            let obj = {
              targetCoin: data.Data[i].CurrencyUnit,
              baseCoin: data.Data[i].MarketTypeName,
              CeId: data.Data[i].CeId
            };
            this.searchArr.push(obj);
          }
        }
      });
      res.catch(error => {});
    },
    keywordInput() {
      // 模糊查询
      this.searchList = [];
      let keyword = this.keyword.toUpperCase().replace(/\s*/g, ""); // 去除空格,不区分大小写
      if (this.keyword == "") return;
      for (var i = 0; i < this.searchArr.length; i++) {
        if (
          this.searchArr[i].targetCoin.indexOf(keyword) >= 0 ||
          this.searchArr[i].targetCoin.indexOf(keyword) >= 0
        ) {
          this.searchList.push(this.searchArr[i]);
        }
      }
    },
    search(val) {
      // 搜索交易对
      if (localStorage.getItem("history")) {
        let arr = JSON.parse(localStorage.getItem("history"));
        arr.unshift(val);
        let newArr = [];
        for (let i = 0; i < arr.length; i++) {
          let flag = true;
          for (let j = 0; j < newArr.length; j++) {
            if (arr[i].CeId == newArr[j].CeId) {
              flag = false;
            }
          }
          if (flag) {
            newArr.push(arr[i]);
          }
        }
        if (arr.length > 5) {
          arr.length = 5;
        }
        localStorage.setItem("history", JSON.stringify(newArr));
        this.getHistory();
      } else {
        this.historyArr.unshift(val);
        localStorage.setItem("history", JSON.stringify(this.historyArr));
        this.getHistory();
      }
      let CeId = val.CeId,
        targetCoin = val.targetCoin,
        baseCoin = val.baseCoin;
      localStorage.setItem("CeId", CeId);
      let CurrencyPair = { targetCoin: targetCoin, baseCoin: baseCoin };
      localStorage.setItem("CurrencyPair", JSON.stringify(CurrencyPair));
      this.updateKlineSymbol({
        baseCoin,
        targetCoin,
        CeId
      });
      this.$router.push({ path: "/QuotationDetail" });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/design/scoped";
header {
  @include bg-icon("headerBg.png", 750px, 111px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: -8px;
  left: 0;
  .coin {
    margin-left: 32px;
    @include bg-icon("search.png", 30px);
  }
  input {
    width: 570px;
    height: 35px;
    font-size: 28px;
    font-family: PingFang-SC-Medium;
    border: none;
    font-weight: 500;
    color: #0e304c;
    &::-webkit-input-placeholder {
      /* WebKit browsers */
      color: #adb7c1;
    }
    &:-moz-placeholder {
      /* Mozilla Firefox 4 to 18 */
      color: #adb7c1;
    }
    &::-moz-placeholder {
      /* Mozilla Firefox 19+ */
      color: #adb7c1;
    }
    &:-ms-input-placeholder {
      /* Internet Explorer 10+ */
      color: #adb7c1;
    }
    &:focus {
      outline: none;
    }
  }
  .back {
    margin-right: 30px;
    font-size: 28px;
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    color: rgba(74, 100, 122, 1);
  }
}
section {
  margin-top: 111px;
  padding: 0 33px;
  ul {
    li {
      font-size: 34px;
      font-family: PingFang-SC-Bold;
      font-weight: bold;
      color: rgba(14, 48, 76, 1);
      line-height: 100px;
    }
  }
  .history {
    div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      p {
        &:nth-child(1) {
          font-size: 26px;
          font-family: PingFang-SC-Medium;
          font-weight: 500;
          color: rgba(80, 86, 92, 1);
          line-height: 100px;
        }
        &:nth-child(2) {
          @include bg-icon("delect.png", 27px, 28px);
        }
      }
    }
  }
}
</style>
