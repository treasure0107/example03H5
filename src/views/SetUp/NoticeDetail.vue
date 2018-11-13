<template>
    <div class="container">
        <header-back></header-back>
        <section>
            <p>{{data.DocTitle}}</p>
            <div class="time">{{data.CreateTime}}</div>
            <div class="content" v-html="data.DocContent"></div>
        </section>
    </div>
</template>
<script>
import Verification from "@/assets/js/Verification";
import headerBack from "@/components/headerBack";
import { getNewsDetail } from "@/service/index";
export default {
  data() {
    return {
      data: {}
    };
  },
  i18n: {
    messages: {
      "zh-CN": {
        header: "公告列表"
      },
      "en-US": {
        header: "notice"
      }
    }
  },
  components: { headerBack },
  mounted() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      const res = getNewsDetail(this.$route.query.id);
      res.then(data => {
        if (Verification.handleData(data)) {
          this.data = data.Data;
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
    p {
      font-size: 38px;
      font-weight: bold;
      color: rgba(14, 48, 76, 1);
      line-height: 58px;
    }
    .time {
      font-size: 24px;
      font-weight: 500;
      color: rgba(128, 140, 153, 1);
      line-height: 72px;
    }
    .content {
      font-size: 30px;
      font-weight: 500;
      color: rgba(14, 48, 76, 1);
      line-height: 50px;
    }
  }
}
</style>

<style>
/* 后台返回图片样式处理 */
.ql-align-center img {
  width: 100% !important;
}
</style>
