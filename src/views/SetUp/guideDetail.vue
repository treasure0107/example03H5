<template>
    <div class="container">
        <header-back>{{$route.query.name}}</header-back>
        <section>
            <img :src="'https://appleusdtcom.oss-cn-shenzhen.aliyuncs.com/icon-png/guide'+$route.query.id+'.jpg'">
        </section>
    </div>
</template>
<script>
import headerBack from "@/components/headerBack";
export default {
  data() {
    return {};
  },
  i18n: {
    messages: {
      "zh-CN": {
        header: "新手指导"
      },
      "en-US": {
        header: ""
      }
    }
  },
  components: { headerBack }
};
</script>
<style lang="scss" scoped>
@import "~@/design/scoped";
.container {
  section {
    margin-top: 80px;
    img {
      width: 100%;
    }
  }
}
</style>
