<template>
  <div>
    <div class="headCon">
      <span class="goBack" @click="$router.go(-1)"></span>
      <span>选择{{name}}提现地址</span>
      <span class="add" @click="$router.push('/addUsdtAdr')">新增地址</span>
    </div>
    <div class="content" >
      <div class="warp" v-if="dataList" v-for="(item, index) in dataList" :key="index" @click="adrFn(item.BlockAddr)">
        <p class="p1" >{{item.Memo}}</p>
        <p class="p2">{{item.BlockAddr}}</p>
      </div>
    </div>
  </div>
</template>
<script type="text/babel">
  import Verification from "@/assets/js/Verification";
  import { GetUserWithdrawAccountList } from '@/service/coinTrade';
  export default {
    data(){
      return {
        name:window.localStorage.getItem('bbUnit'),
        dataList:[]
      }

    },
    mounted(){
      this.GetUserWithdrawAccountList ()
    },
    methods: {
      GetUserWithdrawAccountList () {
        let self = this;
        let ID = window.localStorage.getItem('CurrencyID')
        let option = {
          currencyId:ID
        }; // 参数
        const res = GetUserWithdrawAccountList(option); // 调用请求传参
        res.then(data => {
          if (Verification.handleData(data)) {
            self.dataList = data.Data;
          }
        });
        res.catch(err => {
          // 失败
          console.log(err);
        });
      },
      adrFn(BloAdr) {
        window.localStorage.setItem('BloAdr', BloAdr)
        this.$router.go(-1);
      }
    },
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
    .add {
      font-size:26px;
      font-family:PingFang-SC-Medium;
      color:rgba(50,145,235,1);
      position: absolute;
      right: 30px;
    }
  }
  .content {
    .warp{
      height: 148px;
      padding-left: 30px;
      border-bottom: 1px solid #EEF2F5;
      .p1 {
        font-size:30px;
        font-family:PingFang-SC-Heavy;
        font-weight:800;
        color:rgba(14,48,76,1);
        margin-top: 50px;
      }
      .p2 {
        font-size:26px;
        font-family:PingFang-SC-Medium;
        font-weight:500;
        color:rgba(14,48,76,1);
        margin-top: 15px;
      }
    }
  }
</style>
