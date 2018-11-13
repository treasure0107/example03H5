<template>
    <div class="footer">
        <router-link to="/">
            <p :class="{iconIndexSel:sel == '/',iconIndex:sel != '/'}"></p>
            <p :class="{sel:sel == '/'}">首页</p>
        </router-link>
        <router-link to="/QuotationServer">
            <p :class="{iconQuotationSel:sel == '/QuotationServer',iconQuotation:sel != '/QuotationServer'}"></p>
            <p :class="{sel:sel =='/QuotationServer'}">行情</p>
        </router-link>
        <router-link to="/CoinTrade">
            <p :class="{iconCoinSel:sel == '/CoinTrade',iconCoin:sel != '/CoinTrade'}"></p>
            <p :class="{sel:sel == '/CoinTrade'}">币币</p>
        </router-link>
       <router-link to="/CurrencytTrade">
            <p :class="{iconCurrencytSel:sel == '/CurrencytTrade',iconCurrencyt:sel != '/CurrencytTrade'}"></p>
            <p :class="{sel:sel == '/CurrencytTrade'}">法币</p>
        </router-link>
        <router-link to="/ContractTrade">
            <p :class="{iconContractSel:sel == '/ContractTrade',iconContract:sel != '/ContractTrade'}"></p>
            <p :class="{sel:sel == '/ContractTrade'}">合约</p>
        </router-link>
    </div>
</template>
<script>
export default {
  name: "the-footer",
  data() {
    return {
      sel: 1
    };
  },
  mounted(){
      this.sel = this.$route.path
  },
};
</script>
<style lang="scss" scoped>
@import "~@/design/scoped";
.footer {
  width: 750px;
  height: 117px;
  position: fixed;
  bottom: 0;
  left: 0;
  background: #fff;
  box-shadow:17px 0px  24px 0px rgba(112,150,185,0.16);
  // @include bg-icon("footerBg.png", 750px, 117px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  a {
    display: block;
    width: 150px;
    text-align: center;
  }
  a {
    display: block;
    width: 150px;
    text-align: center;
    border: none;
    p {
      &:nth-child(1) {
        width: 42px;
        height: 42px;
        margin: 9px auto;
      }
      &:nth-child(2) {
        font-size: 20px;
        font-family: PingFang-SC-Medium;
        font-weight: 500;
        color: #808c99;
      }
    }
    .iconIndex {
      @include bg-icon("icon_index.png", 42px);
    }
    .iconIndexSel {
      @include bg-icon("icon_index1.png", 42px);
    }
    .iconQuotation {
      @include bg-icon("icon_quotation.png", 42px);
    }
    .iconQuotationSel {
      @include bg-icon("icon_quotation1.png", 42px);
    }
    .iconCoin {
      @include bg-icon("icon_coin.png", 42px);
    }
    .iconCoinSel {
      @include bg-icon("icon_coin1.png", 42px);
    }
    .iconCurrencyt {
      @include bg-icon("icon_currencyt.png", 42px);
    }
    .iconCurrencytSel {
      @include bg-icon("icon_currencyt1.png", 42px);
    }
    .iconContract {
      @include bg-icon("icon_contract.png", 42px);
    }
    .iconContractSel {
      @include bg-icon("icon_contract1.png", 42px);
    }
    .sel {
      color: rgba(57, 142, 222, 1) !important;
    }
  }
}
</style>

