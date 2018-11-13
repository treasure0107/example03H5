<template>
  <div>
    <div class="headCon">
      <span class="goBack" @click="goBack"></span>
      <span>币种列表
      </span>
    </div>
    <ul v-if="type!=4">
      <li v-for="(item, index) in dataList" :key="index" @click="checkFn(item)" :class="{bg:bg == item.Unit}"
          v-text="item.Unit"></li>
    </ul>
    <ul v-if="type==4">
      <li v-if="item.Unit=='APPLE' || item.Unit=='UFE'" v-for="(item, index) in dataList" :key="index" @click="checkFn(item)"
          :class="{bg:bg == item.Unit}" v-text="item.Unit"></li>
    </ul>
  </div>
</template>
<script type="text/babel">
  import {GetUserAssetList} from '@/service/coinTrade';
  import Verification from "@/assets/js/Verification";
  export default {
    data () {
      return {
        dataList: [],
        bg: '',
        type: ''
      }

    },
    mounted () {
      this.getData();
      this.type = this.$route.query.type;
    },
    methods: {
      goBack(){
        this.$router.push({path: '/accountCoin'});
      },
      checkFn (item) {
        this.bg = item.Unit;
        window.localStorage.setItem('bbUnit', item.Unit);
        window.localStorage.setItem('bbAdr', item.BlockAddr || ' ');
        window.localStorage.setItem('CurrencyID', item.CurrencyID);
        window.localStorage.setItem('WithdrawFeesRate', item.WithdrawFeesRate);
        window.localStorage.setItem('Available', item.Available);
        window.localStorage.setItem('DepositTips', item.DepositTips);
        window.localStorage.setItem('WithdrawTips', item.WithdrawTips);
        window.localStorage.setItem('DepositTips', item.DepositTips);
        window.localStorage.setItem('MaxWithdrawAmount', item.MaxWithdrawAmount);
        window.localStorage.setItem('MinWithdrawAmount', item.MinWithdrawAmount);
        window.localStorage.setItem('MinWithdrawFeesAmount', item.MinWithdrawFeesAmount);
        if (this.$route.query.type == '1') {
          if (item.IsCanDeposit != 1) {
            this.$toast({
              message: "该币种不能提现！",
              position: 'top',
              duration: 2000
            });
            return false;
          }
          this.$router.push('/deposit');
        } else if (this.$route.query.type == '2') {
          if (item.IsCanTransfer != 1) {
            this.$toast({
              message: "该币种不能互转！",
              position: 'top',
              duration: 2000
            });
            return false;
          }
          this.$router.push('/transfer');
        } else if (this.$route.query.type == '3') {
          this.$router.push('/purseAdr');
        } else if (this.$route.query.type == '4') {
          this.$router.push('/sfer');
        } else {
          if (item.IsCanWithdraw != 1) {
            this.$toast({
              message: "该币种不能充值！",
              position: 'top',
              duration: 2000
            });
            return false;
          }
          this.$router.push('/inCoin');
        }
      },
      getData () {
        let self = this;
        let option = {}; // 参数
        const res = GetUserAssetList(option); // 调用请求传参
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
    },
    components: {}
  }

</script>

<style lang="scss" scoped>
  @import '~@/design/scoped';

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

  .con {
    height: 88px;
    line-height: 88px;
    padding: 0px 33px 0px 33px;
    box-shadow: 0px 6px 12px 0px rgba(197, 210, 229, 0.27);
    img {
      width: 30px;
      height: 30px;
    }
    input {
      height: 88px;
      border: none;
      outline: none;
      font-size: 28px;
      margin-left: 25px;
    }
    span {
      float: right;
      font-size: 28px;
      font-family: PingFang-SC-Medium;
      color: rgba(74, 100, 122, 1);
    }
  }

  ul {
    padding: 31px 30px;
    li {
      height: 80px;
      font-size: 34px;
      font-family: PingFang-SC-Bold;
      color: rgba(14, 48, 76, 1);
    }
    .bg {
    }
  }
</style>
