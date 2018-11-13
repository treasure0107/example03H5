<template>
    <div class="container">
        <header-back>{{$t('header')}}</header-back>
        <section>
            <div class="list">
                <h2>关于我们</h2>
                <p>
                    苹果交易所是全球著名数字资产交易所之一，主要提供比特币，以太坊，莱特币等一系列区块链资产的币币交易服务，由区块链及数字资产爱好者创办，核心团队来自迅雷、腾讯、百度，惠普。由注册于塞舌尔的苹果交易中心团队运营，目前运营中心位于新加坡苹果交易中心致力于为区块链资产投资者提供便捷、放心、安全的投资平台。苹果交易中心致力于为区块链资产投资者提供便捷、放心、安全的投资平台。
                </p>
            </div>
            <div class="list">
                <h2>我们的技术</h2>
                <p>
                  1.安全、稳定、可靠的技术积累，是对用户资产安全和服务快速精准的有力保障。<br/>
                  2.手机安保、实名认证安保、Google双重认证安保离线BTC钱包、服务器SLB均衡与同时备份。确保用户与资金安全无忧。<br/>
                  3.实时记账与事物处理机制：用户交易数控实时记账全称事物处理，交易完成后数据实时落地，同时冗余备份，更新缓存，确保用户每一笔账目的正确可靠<br/>
                </p>
            </div>
            <div class="list">
                <h2>我们的愿景</h2>
                <p>
                 平台使用多充技术安全防护打造金融级别的安全数字资产交易网，致力于为数字资产投资爱好者创造一个安全、舒适、快捷的交易平台，使投资者而已放心交易。一用户需求为导向，以提升用户体验为核心，为全球用户提供最可靠，最便捷的数字资产服务。
                </p>
            </div>
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
        header: "关于我们"
      },
      "en-US": {
        header: "about us"
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
      h2 {
        font-size: 36px;
        font-family: PingFang-SC-Bold;
        font-weight: bold;
        color: rgba(14, 48, 76, 1);
        line-height: 100px;
      }
      p {
        font-size: 28px;
        color: rgba(14, 48, 76, 1);
        line-height: 50px;
        margin-bottom: 50px;
      }
    }
  }
}
</style>
