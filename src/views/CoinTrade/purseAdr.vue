<template>
  <div>
    <div class="headCon">
      <span class="goBack"  @click="$router.go(-1)"></span>
      <span>钱包地址管理</span>
    </div>
    <div class="content">
      <leftSlider :index="1" @deleteItem="deleteItem(index, item.ID)" v-for="(item, index) in tableList" :key="key" class="wwar">
        <div class="warp">
          <p class="p1">{{item.Memo}}</p>
          <p class="p2">{{item.BlockAddr}}</p>
        </div>
      </leftSlider>
    </div>
    <div class="btn" @click="goDrr()">添加 <span>{{name}}</span> 钱包地址</div>
  </div>
</template>
<script type="text/babel">
  import {InfiniteScroll, Popup, MessageBox} from 'mint-ui';
  import LeftSlider from '@/components/leftSlider';
  import Bus from "@/assets/js/bus";
  import { getUserMsg } from "@/service/account";
  import Verification from "@/assets/js/Verification";
  import { GetUserWithdrawAccountList, DoDeleteUserWithdrawAccount } from '@/service/coinTrade';
  export default {
    data(){
      return {
        name: window.localStorage.getItem('bbUnit'),
        tableList:[],
        CurrencyID: window.localStorage.getItem('CurrencyID')
      }

    },
    mounted(){
      this.getData ();
    },
    methods: {
      deleteItem: function(index, ID) {
        let self = this;
        let options = ID;
        let res;
        res = DoDeleteUserWithdrawAccount(options); // 调用请求传参
        res.then(data => {
          if (Verification.handleData(data)) {
            MessageBox.confirm('确定要删除吗','提示').then(data => {
              self.tableList.splice(index, 1);
              self.getData ()
            });
            document.getElementsByClassName('mint-msgbox')[0].style.height=129+ 'px';
          }
        });
        res.catch(err => {
          // 失败
          console.log(err);
        });
      },
      getData () {
        let self = this;
        let options = {
          currencyId: self.CurrencyID
        };
        let res;
        res = GetUserWithdrawAccountList(options); // 调用请求传参
        res.then(data => {
          if (Verification.handleData(data)) {
            self.tableList = data.Data;
          }
        });
        res.catch(err => {
          // 失败
          console.log(err);
        });
      },
      setUserInfo() {
        Bus.$on("setUserInfo", () => {
          const res = getUserMsg();
          res.then(data => {
            if (Verification.handleData(data)) {
              localStorage.setItem("UserInfo", JSON.stringify(data.Data));
            }
          });
          res.catch(error => {});
        });
      },
      goDrr() {
        this.setUserInfo();
        var obj = JSON.parse(window.localStorage.getItem('UserInfo'))
        if (!obj.IsSafePwd) {
          this.$toast({
            message: "请先去设置资金密码",
            position: 'top',
            duration: 2000
          });
          return
        } else {
          this.$router.push('/addUsdtAdr');
        }
        //this.$router.push('/addUsdtAdr');
      }
    },
    components: {
      LeftSlider
    }
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
    padding: 81px 30px;
    .wwar {
      -moz-box-shadow:3px 10px 20px #f1f1f1;
      -webkit-box-shadow:3px 10px 20px #f1f1f1;
      box-shadow:3px 10px 20px #f1f1f1;
      .warp{
        width: 98%;
        background: #fff;
        height: 148px;
        padding-bottom: 30px;
        border-radius:4px;
        padding-left: 22px;
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
  }

  .btn {
    width: 100%;
    height: 80px;
    background: #3291EB;
    color: #fff;
    font-family: PingFang-SC-Medium;
    font-size: 30px;
    line-height: 80px;
    text-align: center;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
</style>
