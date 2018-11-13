<!-- 合约交易 -->
<template>
    <div class="wrap">
      <section :style="{height:height}">
        <div class="tips">
          <p></p>
          <p>开发中，敬请期待</p>
        </div>
      </section>
      <the-footer></the-footer>
    </div>
</template>
<script>
import TheFooter from "@/components/footer";
export default {
  components: {
    TheFooter
  },
  data(){
    return {
      height:''
    }
  },
  mounted(){
    this.height = document.documentElement.clientHeight - 117 + "px";
  }
};
</script>
<style lang="scss" scoped>
@import "~@/design/scoped";
.wrap {
  section {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    align-items: center;
    .tips {
      width: 290px;
      text-align: center;
      margin: 0 auto;
      p {
        &:nth-child(1) {
          margin-bottom: 55px;
          @include bg-icon("contractDev.png", 290px, 191px);
        }
        &:nth-child(2) {
          font-size: 30px;
          font-family: PingFang-SC-Medium;
          font-weight: 500;
          color: rgba(128, 135, 142, 1);
        }
      }
    }
  }
}
</style>

