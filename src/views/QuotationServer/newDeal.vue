<template>
    <div class="container">
        <ul class="title">
            <li>时间</li>
            <li>价格({{baseCoin}})</li>
            <li>数量({{targetCoin}})</li>
        </ul>
        <ul v-for="(item,index) in tableList" :key="index">
            <li>{{item.CreateTime.substr(10,16)}}</li>
            <li class="green" v-if="item.IsBuy == 1">{{item.Price}}</li>
            <li class="red" v-else>{{item.Price}}</li>
            <li>{{item.Vol}}</li>
        </ul>
        <div class="null" v-show="tableList.length == 0">暂无数据</div>
    </div>
</template>
<script>
import wsBus from "@/assets/js/wsBus";
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("pairs");
export default {
  data() {
    return {
      tableList: []
    };
  },
  computed: {
    ...mapState(["baseCoin", "targetCoin"])
  },
  mounted() {
    this.getNewOrder();
  },
  methods: {
    getNewOrder() {
      wsBus.$on("OrdersData", data => {
        if(data.length > 30){
          data.length = 30
        }
        this.tableList = data;
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
  margin-top: 35px;
  padding: 0 32px;
  ul {
    display: flex;
    justify-content: space-between;
    li {
      width: 33%;
      font-size: 28px;
      font-family: PingFang-SC-Heavy;
      font-weight: 800;
      color: rgba(14, 48, 76, 1);
      margin: 16px 0;
      &:nth-child(2) {
        text-align: center;
      }
      &:nth-child(3) {
        text-align: right;
      }
    }
  }
  .title {
    li {
      font-size: 30px;
      font-family: PingFang-SC-Heavy;
      font-weight: 800;
      color: rgba(128, 135, 142, 1);
    }
  }
  .red {
    color: #f5174d;
  }
  .green {
    color: #1dd25d;
  }
}
</style>
