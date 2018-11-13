<template>
  <div>
    <div class="headCon">
      <span class="goBack" @click="$router.go(-1)"></span>
      <span class="go" @click="$router.push('/inCoinList?type=2')">站内互转记录</span>
    </div>
    <div class="content">
      <h3><span>{{name}}</span>站内互转</h3>
      <div class="warp">
        <span class="sp1">可转金额</span>
        <input type="text" v-model="Available" disabled>
        <span class="sp2">{{name}}</span>
      </div>
      <div class="warp">
        <span class="sp1" >划转数量</span>
        <input class="w-icon" id="inpp" type="number" v-model="Amount"  @keyup="countFn()" @change="couFn()">
        <span class="sp2">{{name}}</span>
      </div>
      <div class="warp">
        <span class="sp1">对方账户</span>
        <input class="w-icon" type="text" v-model="Accounts">
      </div>
      <div class="warp">
        <span class="sp1">验证码</span>
        <input class="w-icon" type="text" v-model="VerifyCode">
        <!--<span v-if="ihw" class="sp2" style="color:#3291EB" @click="getMsgCode()">获取验证码</span>-->
        <!--<span v-if="!ihw" class="sp2" style="color:#3291EB">{{countdown}} </span>-->
        <span v-if="isMsgCode" class="sp2" style="color:#3291EB" @click="getMsgCode()">获取验证码</span>
        <span v-if="!isMsgCode" class="sp2" style="color:#3291EB">{{timeDown}} 秒后获取</span>
      </div>
      <div class="btn" @click="subFn()">提交</div>
    </div>
    <!--<h5>划转须知</h5>
    <p class="p3" v-html="WithdrawTips"></p>-->
    <mt-popup
      v-model="popupVisible"
      position="bottom">
      <div class="popup">
        <div class="title">
          <p class="left">请输入验证码</p>
          <p class="right" @click="popupVisible = false">取消</p>
        </div>
        <div class="center">
          <input type="text" placeholder="图形验证码" v-model="imgCode">
          <img :src="imgUrl" @click="getImgCode">
        </div>
        <div class="submit" @click="submitImgCode">确定</div>
      </div>
    </mt-popup>
    <!--<mt-popup
      v-model="popupVisible2"
      class="popupVisibleQuery">
      <div class="popup-tit">提示</div>
      <div class="popup-con">对方姓名</div>
      <div class="popBtn" @click="deletePic()">取消</div>
      <div class="popBtn" @click="endFn()">知道了</div>
    </mt-popup>-->
    <mt-popup
      v-model="popupVisible3"
      position="bottom">
      <div class="popup">
        <div class="title">
          <p class="left">请输入资金密码</p>
          <p class="right" @click="popupVisible3 = false">取消</p>
        </div>
        <div class="center">
          <input type="password" v-model="Safepwd" placeholder="资金密码">
          <!--<img src="https://api.appleusdt.com/VerifyImgs/c28de67684624a398b193746ed49ad60.jpg" alt="">-->
        </div>
        <div class="submit" @click="subbFn()">确定</div>
      </div>
    </mt-popup>
    <div class="cover" v-if="show==true">
      <div class="div1">
        <p class="p1">提示</p>
        <p class="pp">对方姓名：<span>{{acc}}</span></p>
        <p class="pp">对方账号：<span>{{Accounts}}</span></p>
        <p class="pp">币种：<span>{{CurrencyUnit}}</span></p>
        <p class="pp">数量：<span>{{Amount}}</span></p>
        <div>
          <p @click="show=false">取消</p>
          <p @click="endFn()">确认</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/babel">
  import headerBack from "@/components/headerBack";
  import {MessageBox} from 'mint-ui';
  import Verification from "@/assets/js/Verification";
  import { GetTradeStrategy, QueryNickName, DoMutualTransfer } from '@/service/coinTrade';
  import {
    getImgCode,
    getMessageCode,
  } from "@/service/account";
  export default {
    data(){
      return {
        name: window.localStorage.getItem('bbUnit'),
        popupVisible: false,
        popupVisible2: true,
        popupVisible3: false,
        Available: window.localStorage.getItem('Available'),
        Amount: '',
        Accounts: '',
        CurrencyUnit: window.localStorage.getItem('bbUnit'),
        imgCode: '',
        ImageCodeKey: '',
        Safepwd: '',
        imgKey: '',
        imgUrl: '',
        strategy:'',
        Status:false,
        acc:'',
        show: '',
        VerifyCode: '',
        WithdrawTips: '',
        countdown: 60,
        timeDown: 60,
        ihw: true,
        isMsgCode: true,
      }

    },
    mounted(){
      this.WithdrawTips = window.localStorage.getItem('WithdrawTips')
    },
    methods: {
      countFn () {
        if (this.Amount==''){
          document.getElementById('inpp').value='';
          return
        };
        if (parseFloat(this.Available) < parseFloat(this.Amount)) {
          this.$toast({
            message: "数量不能大于可划转金额",
            position: 'top',
            duration: 2000
          });
          this.Amount = ''
        }
      },
      couFn () {
        this.Amount = (parseFloat(this.Amount)).toFixed(6);
      },
      getMsgCode(){
//        this.settime ();
        this.imgCode = '';
        this.popupVisible = true;
        this.getImgCode();
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
      deletePic(){
        this.popupVisible2 = false;
      },
      showFn(){
        this.popupVisible2 = true;
      },
      subbFn(){
        this.popupVisible3 = false
        this.show = true;
      },
      subFn() {
        let options = {
          account: this.Accounts,
        };
        const res = QueryNickName(options);
        res.then(data => {
          if(!data.Status){
            this.$toast({
              message: "请输入有效用户！",
              duration: 2000,
              position: 'top'
            });
            return false;
          }
          if (Verification.handleData(data)) {
            this.acc = data.Data;
            this.Status = true;

            if (this.Amount == "") {
              this.$toast({
                message: "请填入数量！",
                duration: 2000
              });
              return false;
            }
            if (this.Accounts == "") {
              this.$toast({
                message: "账户不能为空！",
                duration: 2000
              });
              return false;
            }
            if (this.imgCode == "") {
              this.$toast({
                message: "图形验证码不能为空！",
                duration: 2000
              });
              return false;
            }
            this.popupVisible3 = true;
          }
        });
        res.catch(error => {
        });
      },
      endFn () {
        if (this.SafePwd == "") {
          this.$toast({
            message: "密码不能为空！",
            duration: 2000
          });
          return false;
        }
        let options = {
          VerifyCode: this.VerifyCode,
          ImgCode: this.ImgCode,
          ImageCodeKey: this.imgKey,
          Accounts: this.Accounts,
          Amount: this.Amount,
          Safepwd: this.Safepwd,
          CurrencyUnit: this.CurrencyUnit,
        };
        const res = DoMutualTransfer(options);
        res.then(data => {
          if (!data.Status) {
            this.popupVisible3 = false;
            this.Safepwd = '';
            this.show = false;
          }
          if (Verification.handleData(data)) {
            this.popupVisible3 = false;
            this.$toast({
              message: "划转成功！",
              duration: 2000
            });
            this.$router.push('/accountCoin');
            this.Safepwd = ''
            this.Accounts = ''
            this.Amount = ''
            this.VerifyCode = ''
          }
        });
        res.catch(error => {});
      },
      getImgCode() {
        let options = {
          type: 'DoMutualTransfer',
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
          ImageCodeType: 'DoMutualTransfer',
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
      checkAcc () {
        let options = {
          account: this.Accounts,
        };
        const res = QueryNickName(options);
        res.then(data => {
          if(!data.Status){
            this.$toast({
              message: "请输入有效用户！",
              duration: 2000
            });
            return false;
          }
          if (Verification.handleData(data)) {
            this.acc = data.Data;
            this.Status = true
            this.$toast({
              message: "有效用户！",
              position:'top',
              duration: 2000
            });
          }
        });
        res.catch(error => {
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
  .popupVisibleQuery {
    width: 560px;
    .popup-tit {
      font-size: 34px;
      font-family: PingFang-SC-Heavy;
      font-weight: 600;
      color: rgba(14, 48, 76, 1);
      text-align: center;
      padding: 43px 0;
    }
    .popup-con {
      font-size: 28px;
      font-family: PingFang-SC-Medium;
      color: rgba(14, 48, 76, 1);
      text-align: center;
      padding-bottom: 43px;
      border-bottom: 1px solid #CFD6DB;
    }
    .popBtn {
      height: 100px;
      line-height: 100px;
      text-align: center;
      font-size: 34px;
      font-family: PingFang-SC-Medium;
      color: #3291EB;
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
        width: 50%;
        border: none;
        outline: none;
        font-size:28px;
        margin-left: 50px;
        color:#80878E;
      }
      input:disabled {
        background: #fff;
      }
      .w-icon{
        color:#0e304c;
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
  .cover {
    position: fixed;
    top:0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    .div1 {
      width: 500px;
      height: 340px;
      border-radius: 5px;
      margin:auto;
      margin-top: 65%;
      background: #fff;
      padding-top: 10px;
      .p1 {
        text-align: center;
        font-size: 30px;
        font-family: PingFang-SC-Medium;
      }
      .p2 {
        margin-top: 20px;
        text-align: center;
        font-size: 30px;
        font-family: PingFang-SC-Medium;
      }
      .pp {
        margin-top: 10px;
        text-align: center;
        font-size: 20px;
        font-family: PingFang-SC-Medium;
      }
      div {
        margin-top: 30px;
        display: flex;
        border-top: 1px solid #ddd;
        p {
          flex:1;
          text-align: center;
          height: 60px;
          line-height: 60px;
          font-family: PingFang-SC-Medium;
        }
        p:last-child {
          border-left: 1px solid #ddd;
        }
      }
    }
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
    .pp {
      font-size: 16px;
      margin-top: 5px;
    }

  }
</style>
