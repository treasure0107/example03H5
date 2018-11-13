<template>
  <div>
    <div class="headCon">
      <span class="goBack" @click="$router.go(-1)"></span>
    </div>
    <div class="content">
      <h3><span>添加{{name}}</span>钱包地址</h3>
      <div class="warp">
        <input type="text" placeholder="输入或长按粘贴地址" v-model="BlockAddr">
      </div>
      <div class="warp">
        <input type="text" placeholder="标签，如：Bianca地址" v-model="Memo">
      </div>
      <div class="warp">
        <span class="sp1">验证码</span>
        <input type="text" class="ipt" placeholder="请输入验证码" v-model="VerifyCode">
        <!--<span v-if="ihw" class="sp2" style="color:#3291EB" @click="getMsgCode()">获取验证码</span>-->
        <!--<span v-if="!ihw" class="sp2" style="color:#3291EB">{{countdown}} </span>-->
        <span v-if="isMsgCode" class="sp2" style="color:#3291EB" @click="getMsgCode()">获取验证码</span>
        <span v-if="!isMsgCode" class="sp2" style="color:#3291EB">{{timeDown}} 秒后获取</span>
      </div>
      <div class="btn" @click="subFn()">提交</div>
    </div>
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
        <div class="submit" @click="submitImgCode" >确定</div>
      </div>
    </mt-popup>
    <mt-popup
      v-model="popupVisible2"
      position="bottom">
      <div class="popup">
        <div class="title">
          <p class="left">请输入资金密码</p>
          <p class="right" @click="popupVisible = false">取消</p>
        </div>
        <div class="center">
          <input type="password" v-model="SafePwd" placeholder="资金密码">
          <!--<img src="https://api.appleusdt.com/VerifyImgs/c28de67684624a398b193746ed49ad60.jpg" alt="">-->
        </div>
        <div class="submit" @click="endFn()">确定</div>
      </div>
    </mt-popup>
  </div>
</template>
<script type="text/babel">
  import headerBack from "@/components/headerBack";
  import Verification from "@/assets/js/Verification";
  import { GetTradeStrategy, DoAddUserWithdrawAccount } from '@/service/coinTrade';
  import {
    getImgCode,
    getMessageCode,
  } from "@/service/account";
  export default {
    data(){
      return {
        popupVisible: false,
        popupVisible2: false,
        name:window.localStorage.getItem('bbUnit'),
        CurrencyId:window.localStorage.getItem('CurrencyId'),
        VerifyCode: '',
        SafePwd: '',
        imgCode: '',
        imgUrl: '',
        type: '',
        Memo: '',
        BlockAddr: '',
        strategy: '',
        countdown: 60,
        timeDown: 60,
        isMsgCode: true,
        ihw: true
      }

    },
    mounted(){
    },
    methods: {
      getMsgCode() {
//        this.settime ();
        this.imgCode = '';
        this.getImgCode();
        this.popupVisible = true;
      },
      settime () {
        var self = this;
        if (self.countdown == 0) {
          self.countdown = 60;
          self.ihw = true;
          return;
        } else {
          self.ihw = false;
          self.countdown--;
        }
        setTimeout(function() {
          self.settime()
        },1000)
      },
      getImgCode() {
        let options = {
          type: 'AddWithdrawAddr',
        };
        const res = getImgCode(options);
        res.then(data => {
          if (Verification.handleData(data)) {
            this.imgKey = data.Data.ImgKey;
            this.imgUrl = data.Data.ImgUri;
          }
        });
        res.catch(error => {});
      },
      endFn () {
        let options = {
          CurrencyId: window.localStorage.getItem('CurrencyID'),
          BlockAddr: this.BlockAddr,
          VerifyCode: this.VerifyCode,
          Memo: this.Memo,
          SafePwd: this.SafePwd,
        };
        const res = DoAddUserWithdrawAccount(options);
        res.then(data => {
          if (Verification.handleData(data)) {
            this.popupVisible2 = true;
            this.$router.go(-1);
          }
        });
        res.catch(error => {});
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
          ImageCodeType: 'AddWithdrawAddr',
          ImageCodeKey: this.imgKey
        };
        const res = getMessageCode(options);
        res.then(data => {
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

        });
      },
      subFn() {
        if (!this.BlockAddr) {
          this.$toast({
            message: "请先填入地址",
            position: 'top',
            duration: 2000
          });
          return
        }
        if (!this.Memo) {
          this.$toast({
            message: "请填入标签",
            position: 'top',
            duration: 2000
          });
          return
        }
        this.popupVisible2 = true;
      },
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
      font-size:52px;
      font-family:PingFang-SC-Heavy;
      font-weight:600;
      color:rgba(14,48,76,1);
    }
    .warp {
      border-bottom: 1px solid #EEF2F5;
      margin-top: 50px;
      height: 50px;
      position: relative;
      .sp1 {
        font-size:26px;
        font-family:PingFang-SC-Medium;
        font-weight:500;
        color:rgba(74,100,122,1);
      }
      input {
        width: 100%;
        border: none;
        outline: none;
        font-size:28px;
        // margin-left: 50px;
        color:#919AA8;
      }
      .ipt {
        width: 50%!important;
      }
      .sp2 {
        font-size:28px;
        font-family:PingFang-SC-Medium;
        color:#0E304C;
        position: absolute;
        top:5px;
        right: 10px;
      }
      img {
        width: 16px;
        height: 31px;
        position: absolute;
        top:5px;
        right: 10px;
      }
    }
    p {
      font-size:24px;
      margin-top: 10px;
      font-family:PingFang-SC-Medium;
      font-weight:500;
      color:rgba(173,183,193,1);
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
    font-size:30px;
    font-family:PingFang-SC-Medium;
    color:rgba(50,145,235,1);
    text-align: center;
    margin-top: 36px;
  }
  .p2 {
    font-size:28px;
    font-family:PingFang-SC-Medium;
    color:rgba(80,86,92,1);
    text-align: center;
    margin-top: 110px;
    width: 80%;
    margin-left: 10%;
  }
  h5 {
    margin-top: 70px;
    margin-left: 30px;
    font-size:28px;
    font-family:PingFang-SC-Medium;
    color: #0E304C;
  }
  .p3 {
    font-size:24px;
    font-family:PingFang SC;
    color:#B5C0CB;
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
