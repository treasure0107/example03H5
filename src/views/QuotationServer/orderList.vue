<template>
    <div class="container">
        <head>
            <p>买盘 数量({{targetCoin}})</p>
            <p>价格({{baseCoin}})</p>
            <p>卖盘 数量({{targetCoin}})</p>
        </head>
        <section>
            <div>
                <dl v-for="(item,index) in ask" :key="index">
                    <dt>{{item.NoComplete}}</dt>
                    <dt class="green">{{item.price}}</dt>
                </dl>
            </div>
            <div>
                <dl v-for="(item,index) in bid" :key="index">
                    <dt class="red">{{item.price}}</dt>
                    <dt>{{item.NoComplete}}</dt>
                </dl>
            </div>
        </section>
        <div class="null" v-show="ask.length == 0 && bid.length == 0">暂无数据</div>
    </div>
</template>
<script>
import wsBus from "@/assets/js/wsBus";
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("pairs");
export default {
  data() {
    return {
      tableData: [],
      ask:[],
      bid:[]
    };
  },
  computed: {
    ...mapState(["baseCoin", "targetCoin"])
  },
  mounted() {
    this.getTableList();
  },
  methods: {
    getTableList() {
      wsBus.$on("DepthData", data => {
        if(data.Ask.length > 15){
          data.Ask.length = 15
        }
        this.ask = data.Ask;
        if(data.Bid.length > 15){
          data.Bid.length = 15
        }
        this.bid = data.Bid;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.null{
  text-align: center;
  height: 100px;
  line-height: 100px;
  font-family: PingFang-SC-Heavy;
  font-size: 26px;
  color: rgba(128, 135, 142, 1);
}
.container {
  padding: 0 30px;
  head {
    margin: 10px 0;
    display: flex;
    justify-content: space-between;
    p {
      font-size: 26px;
      font-family: PingFang-SC-Heavy;
      font-weight: 800;
      color: rgba(128, 135, 142, 1);
      width: 33.3%;
      &:nth-child(2) {
        text-align: center;
      }
      &:nth-child(3) {
        text-align: right;
      }
    }
  }
  section {
    display: flex;
    justify-content: space-between;
    div {
      width: 49.5%;
      font-size: 20px;
      font-family: PingFang-SC-Heavy;
      font-weight: 800;
      color: rgba(14, 48, 76, 1);
      dl {
        width: 100%;
        display: flex;
        margin: 20px 0;
        justify-content: space-between;
        .green {
          color: #1dd25d;
        }
        .red {
          color: #f5174d;
        }
      }
    }
  }
}
</style>
