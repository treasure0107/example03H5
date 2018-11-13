<template>
    <div class="container">
        <header-back>{{$t('header')}}</header-back>
        <section>
          <div class="list">
              <p class="title">一、导言</p>
              <p class="detail">1.1我们保证审慎遵守与了解你的客户和反洗钱相关的法律法规且不得故意违反该了解你的客户和反洗钱政策。在我们合理控制的范围内我们财务必要的措施和技术为您提供安全的服务，尽可能使您免于遭受犯罪嫌疑人的洗钱行为带来的损失。</p>
          </div>
          <div class="list">
              <p class="title">十、协议的生效和解释</p>
              <p class="detail">我们保留不时修订本协议、并以网站公示的方式进行公告、不再单独通知您的权利，变更后的协议会在本协议首页标注变更时间，一经在网站公布，立即自动生效。您应不时浏览及关注本协议的更新变更时间及更新内容，如您不同意相关变更，应当立即停止使用本网站服务；您继续使用本网站服务，即表示您接受并同意经修订的协议的约束。</p>
          </div>
          <footer>了解你的客户和<router-link to="">反洗钱政策</router-link></footer>
        </section>
    </div>
</template>
<script>
import headerBack from "@/components/headerBack";
export default {
  data() {
    return {
      tableList: []
    };
  },
  i18n: {
    messages: {
      "zh-CN": {
        header: "反洗钱政策"
      },
      "en-US": {
        header: "rate detail"
      }
    }
  },
  components: { headerBack },
  mounted() {},
  methods: {}
};
</script>
<style lang="scss" scoped>
@import "~@/design/scoped";
.container {
  section {
    margin-top: 111px;
    padding: 0 30px;
    .list {
      .title {
        font-size: 30px;
        font-weight: 500;
        color: rgba(14, 48, 76, 1);
        margin: 38px 0;
      }
      .detail {
        font-size: 28px;
        font-weight: 500;
        color: rgba(128, 135, 142, 1);
        line-height: 42px;
      }
    }
  }
  footer {
    font-size: 28px;
    font-weight: 500;
    margin: 39px 0;
    color: rgba(128, 135, 142, 1);
    a{
        color: $blue;
    }
  }
}
</style>
