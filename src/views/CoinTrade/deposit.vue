<template>
  <div>
    <div class="headCon">
      <span class="goBack" @click="$router.go(-1)"></span>
      <span class="go" @click="$router.push('/inCoinList?type=1')">提现记录</span>
    </div>
    <div class="content">
      <h3><span>{{name}}</span>提现</h3>
      <div class="warp">
        <span class="sp1">可提现</span>
        <input type="text" v-model="Available" disabled>
        <span class="sp2">{{name}}</span>
      </div>
      <div class="warp" @click="$router.push('/outCoinAdr')">
        <span class="sp1">提币地址</span>
        <input class="w-icon" type="text" v-model="BlockAddr" disabled>
        <!--<img src="~@/assets/icon-png/rig.png" alt="">-->
        <span class="img"></span>
      </div>
      <div class="warp">
        <span class="sp1">提现数量</span>
        <input class="w-icon" id="inpp" type="number" v-model="SubmitAmount" @keyup="countFn()" @change="couFn()">
        <span class="sp2">{{name}}</span>
      </div>
      <p>提现手续费率 <span style="color:#F5174D" v-text="WithdrawFeesRate">2%</span> 预计到账：<span style="color:#0E304C"
                                                                                           v-text="count">0.000000BTC</span>
      </p>
      <div class="warp" v-if="SmsCode">
        <span class="sp1">验证码</span>
        <input class="w-icon" type="text" v-model="VerifyCode">
        <!--<span v-if="ihw" class="sp2" style="color:#3291EB" @click="getMsgCode()">获取验证码</span>-->
        <!--<span v-if="!ihw" class="sp2" style="color:#3291EB">{{countdown}} 秒后获取</span>-->
        <span v-if="isMsgCode" class="sp2" style="color:#3291EB" @click="getMsgCode()">获取验证码</span>
        <span v-if="!isMsgCode" class="sp2" style="color:#3291EB">{{timeDown}} 秒后获取</span>
      </div>
      <div class="warp" v-if="SmsCode==false">
        <span class="sp1">谷歌验证码</span>
        <input type="text" v-model="goleVerifyCode">
      </div>
      <div class="btn" @click="subFn()">提交</div>
    </div>
    <h5>提现须知</h5>
    <p class="p3" v-html="WithdrawTips==null?'':WithdrawTips"></p>
    <mt-popup
      v-model="popupVisible"
      position="bottom">
      <div class="popup">
        <div class="title">
          <p class="left">请输入图形验证码</p>
          <p class="right" @click="popupVisible = false">取消</p>
        </div>
        <div class="center">
          <input type="text" placeholder="图形验证码" v-model="imgCode">
          <img :src="imgUrl" @click="getImgCode">
        </div>
        <div class="submit" @click="submitImgCode">确定</div>
      </div>
    </mt-popup>
    <mt-popup
      v-model="popupVisible2"
      position="bottom">
      <div class="popup">
        <div class="title">
          <p class="left">请输入资金密码</p>
          <p class="right" @click="delFn()">取消</p>
        </div>
        <div class="center">
          <input type="password" v-model="SafePwd" placeholder="资金密码">
          <!--<img src="https://api.appleusdt.com/VerifyImgs/c28de67684624a398b193746ed49ad60.jpg" alt="">-->
        </div>
        <div class="submit" @click="clck()">确定</div>
      </div>
    </mt-popup>
  </div>
</template>
<script type="text/babel">
  import headerBack from "@/components/headerBack";
  import Verification from "@/assets/js/Verification";
  import {GetTradeStrategy, DoWithdraw, GetWithDrawStrategy} from '@/service/coinTrade';
  import {
    getImgCode,
    getMessageCode,
  } from "@/service/account";
  export default {
    data(){
      return {
        popupVisible: false,
        popupVisible2: false,
        name: '',
        VerifyCode: '',
        SubmitAmount: '',
        Available: '',
        BlockAddr: '',
        imgCode: '',
        imgUrl: '',
        SafePwd: '',
        goleVerifyCode: '',
        strategy: '',
        WithdrawFeesRate: '',
        count: '',
        WithdrawTips: '',
        MaxWithdrawAmount: '',
        MinWithdrawAmount: '',
        MinWithdrawFeesAmount: '',
        SmsCode: true,
        isck: true,
        countdown: 60,
        timeDown: 60,
        ihw: true,
        isMsgCode: true
      }

    },
    mounted(){
      this.name = window.localStorage.getItem('bbUnit');
      this.WithdrawFeesRate = window.localStorage.getItem('WithdrawFeesRate')
      this.Available = window.localStorage.getItem('Available');
      this.BlockAddr = window.localStorage.getItem('BloAdr');
      this.WithdrawTips = window.localStorage.getItem('WithdrawTips')
      this.DepositTips = window.localStorage.getItem('DepositTips')
      this.MaxWithdrawAmount = window.localStorage.getItem('MaxWithdrawAmount')
      this.MinWithdrawAmount = window.localStorage.getItem('MinWithdrawAmount')
      this.MinWithdrawFeesAmount = window.localStorage.getItem('MinWithdrawFeesAmount')
      window.localStorage.removeItem('BloAdr');
      this.vailFn();
    },
    methods: {
      getMsgCode() {
//        this.settime ();
        this.getImgCode();
        this.VerifyCode = '';
        this.imgCode = '';
        this.popupVisible = true;
      },
//      settime () {
//        var self = this;
//        if (self.countdown == 0) {
//          self.countdown = 60;
//          self.ihw = true;
//          return;
//        } else {
//          self.ihw = false;
//          self.countdown--;
//        }
//        setTimeout(function () {
//          self.settime()
//        }, 1000)
//      },
      delFn() {
        this.popupVisible2 = false;
        this.SafePwd = '';
        this.GoogleCode = '';
        this.VerifyCode = '';
      },
      clck(){
        if (this.isck) {
          this.isck = false;
          this.endFn()
          setTimeout(data => {
            this.isck = true;
          }, 2000);
        }
      },
      getImgCode() {
        let options = {
          type: 'DoWithdraw',
        };
        const res = getImgCode(options);
        res.then(data => {
          if (Verification.handleData(data)) {
            this.imgKey = data.Data.ImgKey;
            this.imgUrl = data.Data.ImgUri;
          }
        });
        res.catch(error => {
        });
      },
      countFn () {
        if (this.SubmitAmount == '') {
          document.getElementById('inpp').value = '';
          return
        }
        ;
        this.count = (this.SubmitAmount * (1 - this.WithdrawFeesRate)).toFixed(6)
        if (parseInt(this.count) > parseInt(this.Available)) {
          this.$toast({
            message: "提现不能大于可提现！",
            position: 'top',
            duration: 2000
          });
          this.SubmitAmount = ''
        }
      },
      couFn () {
        this.SubmitAmount = (parseFloat(this.SubmitAmount)).toFixed(6);
        if (parseFloat(this.SubmitAmount) < parseFloat(this.MinWithdrawAmount)) {
          this.$toast({
            message: "提现不能小于" + this.MinWithdrawAmount + "！",
            position: 'top',
            duration: 2000
          });
          this.SubmitAmount = ''
          this.count = ''
          return false
        }
        if (parseFloat(this.MaxWithdrawAmount) != 0) {
          if (parseFloat(this.SubmitAmount) > parseFloat(this.MaxWithdrawAmount)) {
            this.$toast({
              message: "提现不能大于" + this.MaxWithdrawAmount + "！",
              position: 'top',
              duration: 2000
            });
            this.SubmitAmount = ''
            this.count = ''
            return false
          }
        }
        this.count = (this.SubmitAmount * this.WithdrawFeesRate).toFixed(6);
        //var count2 = (this.SubmitAmount*(1-parseFloat(this.MinWithdrawFeesAmount))).toFixed(6);
        this.count == 'NaN' ? this.count = 0 : this.count = this.count;
        //this.count2 == 'NaN'?this.count2=0:this.count2=this.count2;
        if (parseFloat(this.count) < parseFloat(this.MinWithdrawFeesAmount)) {
          this.count = parseFloat(this.SubmitAmount) - parseFloat(this.MinWithdrawFeesAmount);
        } else {
          this.count = (this.SubmitAmount * (1 - this.WithdrawFeesRate)).toFixed(6);
        }
        if (parseInt(this.count) > parseInt(this.Available)) {
          this.$toast({
            message: "提现不能大于可提现！",
            position: 'top',
            duration: 2000
          });
          this.SubmitAmount = ''
        }
      },
      endFn () {
        if (this.popupVisible && this.SafePwd == "") {
          this.$toast({
            message: "密码不能为空！",
            duration: 2000
          });
          return false;
        }
        this.settime();
        let options = {
          CurrencyId: window.localStorage.getItem('CurrencyID'),
          BlockAddr: this.BlockAddr,
          VerifyCode: this.VerifyCode,
          SubmitAmount: this.SubmitAmount,
          GoogleCode: this.goleVerifyCode,
          SafePwd: this.SafePwd,
        };
        const res = DoWithdraw(options);
        res.then(data => {
          if (!data.Status) {
            this.popupVisible2 = false;
            this.SafePwd = '';
            this.GoogleCode = '';
            this.VerifyCode = '';
          }
          if (Verification.handleData(data)) {
            this.popupVisible2 = true;
            this.$toast({
              message: "提现成功！",
              duration: 2000
            });
            this.$router.push('/accountCoin');
            this.VerifyCode = '';
            this.SubmitAmount = '';
            this.BlockAddr = '';
            this.goleVerifyCode = '';
            this.SafePwd = '';
          }
        });
        res.catch(error => {
        });
      },
      // 获取短信/邮箱验证码
      submitImgCode() {
        if (this.imgCode == "") {
          this.$toast({
            message: "图形验证码不能为空！",
            duration: 2000
          });
          return false;
        }
        let UserInfo = JSON.parse(localStorage.getItem("UserInfo"));
        let account = UserInfo.PhoneNumber
          ? UserInfo.PhoneNumber
          : UserInfo.Email;
        let options = {
          Account: account,
          ImgCode: this.imgCode,
          ImageCodeType: 'DoWithdraw',
          ImageCodeKey: this.imgKey
        };
        const res = getMessageCode(options);
        res.then(data => {
          if (!data.Status) {
            this.popupVisible = false;
          }
          if (Verification.handleData(data)) {
            this.$toast({
              message: "验证码发送成功！",
              duration: 2000
            });
            this.popupVisible = false;
            this.isMsgCode = false;
            let timer = setInterval(() => {
              this.timeDown--;
              if (this.timeDown == 0) {
                this.isMsgCode = true;
                this.timeDown = 60;
                clearInterval(timer);
              }
            }, 1000);
          }
        });
        res.catch(error => {
          this.popupVisible = false;
        });
      },
      subFn() {
        if (!this.BlockAddr) {
          this.$toast({
            message: "请先选择地址",
            position: 'top',
            duration: 2000
          });
          return
        }
        if (!this.VerifyCode && this.SmsCode) {
          this.$toast({
            message: "请填入正确验证码",
            position: 'top',
            duration: 2000
          });
          return
        }
        if (!this.goleVerifyCode && !this.SmsCode) {
          this.$toast({
            message: "请填入正确的谷歌验证码",
            position: 'top',
            duration: 2000
          });
          return
        }
        if (!this.SubmitAmount) {
          this.$toast({
            message: "请填入正确的数量",
            position: 'top',
            duration: 2000
          });
          return
        }
        /*var obj = JSON.parse(window.localStorage.getItem('UserInfo'))
         if (!obj.IsSafePwd) {
         this.$toast({
         message: "请先去设置密码",
         position: 'top',
         duration: 2000
         });
         return
         } else {
         this.popupVisible2 = true;
         }*/
        this.popupVisible2 = true;
      },
      vailFn () {
        // this.popupVisible = true;
        let option = {}; // 参数
        const res = GetWithDrawStrategy(option); // 调用请求传参
        res.then(data => {
          if (Verification.handleData(data)) {
            if (data.Data == 'SmsCode') {
              this.SmsCode = true
            } else {
              this.SmsCode = false
            }
          }
        });
        res.catch(err => {
          // 失败
          console.log(err);
        });
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
    text-align: right;
    font-size: 34px;
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    color: rgba(14, 48, 76, 1);
    box-shadow: 0px 6px 12px 0px rgba(197, 210, 229, 0.27);
    background-color: #fff;
    padding-right: 60px;
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
    padding: 30px 60px;
    h3 {
      font-size: 52px;
      font-family: PingFang-SC-Heavy;
      font-weight: 600;
      color: rgba(14, 48, 76, 1);
    }
    .warp {
      border-bottom: 1px solid #EEF2F5;
      margin-top: 50px;
      height: 50px;
      position: relative;
      .sp1 {
        font-size: 26px;
        font-family: PingFang-SC-Medium;
        font-weight: 500;
        color: rgba(74, 100, 122, 1);
      }
      input {
        width: 50%;
        border: none;
        outline: none;
        font-size: 28px;
        margin-left: 50px;
        color: #80878E;
      }
      input:disabled {
        background: #fff;
      }
      .w-icon{
        color:#0e304c;
      }
      .sp2 {
        font-size: 28px;
        font-family: PingFang-SC-Medium;
        color: #0E304C;
        position: absolute;
        top: 5px;
        right: 10px;
      }
      .img {
        width: 16px;
        height: 31px;
        position: absolute;
        top: 5px;
        right: 10px;
        @include bg-icon('rig.png', 30px);
      }
    }
    p {
      font-size: 24px;
      margin-top: 10px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(173, 183, 193, 1);
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
    margin-top: 100px;
  }

  .p1 {
    font-size: 30px;
    font-family: PingFang-SC-Medium;
    color: rgba(50, 145, 235, 1);
    text-align: center;
    margin-top: 36px;
  }

  .p2 {
    font-size: 28px;
    font-family: PingFang-SC-Medium;
    color: rgba(80, 86, 92, 1);
    text-align: center;
    margin-top: 110px;
    width: 80%;
    margin-left: 10%;
  }

  h5 {
    margin-top: 70px;
    margin-left: 30px;
    font-size: 28px;
    font-family: PingFang-SC-Medium;
    color: #0E304C;
  }

  .p3 {
    font-size: 24px;
    font-family: PingFang SC;
    color: #B5C0CB;
    margin-left: 30px;
    line-height: 54px;
    margin-top: 20px;
  }

  .popup {
    width: 750px;
    height: 450px;
    background: rgba(255, 255, 255, 1);
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 40px 30px 27px 30px;
      border-bottom: 2px solid #cfd6db;
      .left {
        font-size: 32px;
        font-weight: 800;
        color: rgba(14, 48, 76, 1);
      }
      .right {
        font-size: 26px;
        font-weight: 500;
        color: rgba(173, 183, 193, 1);
      }
    }
    .center {
      margin: 72px 30px;
      padding: 8px 0;
      display: flex;
      justify-content: space-between;
      border-bottom: 2px solid #cfd6db;
      input[type="text"] {
        width: 570px;
        height: 60px;
        border: none;
        font-size: 26px;
        &:focus {
          outline: none;
        }
      }
      input[type="password"] {
        width: 570px;
        height: 60px;
        border: none;
        font-size: 26px;
        &:focus {
          outline: none;
        }
      }
      img {
        width: 120px;
        height: 60px;
      }
    }
    .submit {
      width: 690px;
      height: 80px;
      margin: 18px auto;
      background: $blue;
      border-radius: 4px;
      color: #fff;
      text-align: center;
      line-height: 80px;
    }
  }
</style>
