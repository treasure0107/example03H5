<template>
    <div class="container">
        <header-back>{{$t('header')}}</header-back>
        <section>
          <div class="head">
            <p>币种</p>
            <p>吃单费率</p>
            <p>挂单费率</p>
          </div>
          <div class="table">
            <ul v-for="(item, index) in tableList" :key="index">
              <li>{{item}}</li>
              <li>0.2%</li>
              <li>0.2%</li>
            </ul>
          </div>
        </section>
    </div>
</template>
<script>
import headerBack from "@/components/headerBack";
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("pairs");
import { getRate } from "@/service/index";
export default {
  data() {
    return {
      tableList: []
    };
  },
  i18n: {
    messages: {
      "zh-CN": {
        header: "费率详情"
      },
      "en-US": {
        header: "rate detail"
      }
    }
  },
  components: { headerBack },
  computed: {
    ...mapState(["theme"])
  },
  mounted() {
    this.getRate();
  },
  methods: {
    getRate() {
      const res = getRate();
      res.then(data => {
        for (let i = 0; i < data.Data.length; i++) {
          this.tableList.push(data.Data[i].Unit);
        }
      });
      res.catch(error => {});
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/design/scoped";
.container {
  section {
    margin-top: 111px;
    padding: 0 30px;
    .head {
      height: 80px;
      display: flex;
      justify-content: space-between;
      color: #80878e;
      font-size: 28px;
      line-height: 80px;
      p {
        width: 33%;
        &:nth-child(1) {
          text-align: left;
        }
        &:nth-child(2) {
          text-align: center;
        }
        &:nth-child(3) {
          text-align: right;
        }
      }
    }
    .table {
      ul {
        height: 80px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 32px;
        color: #0d2b47;
        font-weight: bold;
        li {
          width: 33%;
          &:nth-child(1) {
            text-align: left;
          }
          &:nth-child(2) {
            text-align: center;
          }
          &:nth-child(3) {
            text-align: right;
          }
        }
      }
    }
  }
}
</style>
