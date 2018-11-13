<template>
  <div>
    <div class="headCon">
      <span class="goBack"  @click="$router.go(-1)"></span>
      <span>币币账户充值</span>
    </div>
    <div class="content" @click="$router.push('/serCoin')">
      <span>选择币种</span>
      <span class="img"></span>
    </div>
  </div>
</template>
<script type="text/babel">
  export default {
    data(){
      return {}

    },
    mounted(){

    },
    methods: {},
    components: {}
  }

</script>

<style lang="scss" scoped>
  @import '~@/design/scoped';
  body {
  }
  .headCon {
    height: 88px;
    line-height: 88px;
    position: relative;
    text-align: center;
    font-size: 34px;
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    color: rgba(14, 48, 76, 1);
    box-shadow: 0px 6px 12px 0px rgba(197, 210, 229, 0.27);
    background-color: #fff;
    .goBack {
      position: absolute;
      top: 28px;
      left: 30px;
      width: 30px;
      height: 30px;
      @include bg-icon('goBack.png', 30px);
    }
  }
  .content {
    background: #F7FBFC;
    height: 130px;
    line-height: 130px;
    position: relative;
    padding-left: 30px;
    span {
      font-size:38px;
      font-family:PingFang-SC-Medium;
      color:rgba(14,48,76,1);
    }
    .img {
      position: absolute;
      width: 16px;
      height: 31px;
      top:50px;
      right: 49px;
      @include bg-icon('rig.png', 30px);
    }
  }
</style>
