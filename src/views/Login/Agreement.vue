<template>
    <div class="container">
        <header-back>{{$t('header')}}</header-back>
        <section>
          <div class="list" v-html="tableList.DocContent"></div>
          <!-- <footer>了解你的客户和<router-link to="/Policy">反洗钱政策</router-link></footer> -->
        </section>
    </div>
</template>
<script>
import headerBack from "@/components/headerBack";
import Verification from "@/assets/js/Verification";
import { getAgreement } from "@/service/account";
export default {
  data() {
    return {
      tableList: []
    };
  },
  i18n: {
    messages: {
      "zh-CN": {
        header: "用户协议"
      },
      "en-US": {
        header: "rate detail"
      }
    }
  },
  components: { headerBack },
  mounted() {
    this.getAgreement();
  },
  methods: {
    getAgreement() {
      const res = getAgreement();
      res.then(data => {
        if (Verification.handleData(data)) {
          this.tableList = data.Data;
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
    .list {
      font-size: 28px;
      font-weight: 500;
      color: rgba(128, 135, 142, 1);
      line-height: 50px;
      // .title {
      //   font-size: 30px;
      //   font-weight: 500;
      //   color: rgba(14, 48, 76, 1);
      //   margin: 38px 0;
      // }
      // .detail {
      //   font-size: 28px;
      //   font-weight: 500;
      //   color: rgba(128, 135, 142, 1);
      //   line-height: 42px;
      // }
    }
  }
  // footer {
  //   font-size: 28px;
  //   font-weight: 500;
  //   margin: 39px 0;
  //   color: rgba(128, 135, 142, 1);
  //   a {
  //     color: $blue;
  //   }
  // }
}
</style>
