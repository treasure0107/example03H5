<template>
  <div>
    <div class="headCon">
      <span class="goBack"  @click="$router.go(-1)"></span>
      <span>币币账户充值</span>
      <span class="market" @click="$router.push('/inCoinList')">充值记录</span>
    </div>
    <div class="content" @click="$router.go(-1)">
      <span v-text="bbUnit">选择币种</span>
    </div>
    <canvas id="msg"></canvas>
    <!--<p class="p1">保存二维码图片</p>-->
    <p class="p2" v-text="bbAdr"></p>
    <button class="p1 p4 tag-read" :data-clipboard-text="bbAdr" @click="copy">复制地址</button>
    <h5>充值须知</h5>
    <!--<p class="p3">1.禁止向USDT地址充值除USDT之外的资产，任何充入USDT地址-->
      <!--的非USDT资产将不可找回。<br/>2.使用USDT地址充值需要2个网络确认才能到账，使用站内账户-->
      <!--间转账无需网络确认，可以实时到账。</p>-->
    <div class="didd" v-html="DepositTips==null?'':DepositTips" style="padding: 10px 20px;font-size: 14px"></div>
  </div>
</template>
<script type="text/babel">
  import Verification from "@/assets/js/Verification";
  import {InfiniteScroll, Popup, MessageBox} from 'mint-ui';
  import Clipboard from 'clipboard';
  import QRCode from 'qrcode'
  let clipboard = new Clipboard('.tag-read')
  export default {
    data(){
      return {
        bbAdr: '',
        bbUnit: '',
        DepositTips: ''
      }

    },
    mounted(){
      let self = this;
      self.bbAdr = window.localStorage.getItem('bbAdr');
      self.bbUnit = window.localStorage.getItem('bbUnit');
      self.DepositTips = window.localStorage.getItem('DepositTips');
      var msg = document.getElementById('msg')
      // 将获取到的数据（val）画到msg（canvas）上
      QRCode.toCanvas(msg, self.bbAdr, function (error) {
        console.log(error)
      })
      msg.style.height = '154px';
      msg.style.width = '154px';
      msg.style.margin = '0 0 0 30%';
      document.getElementsByClassName('didd')[0].style.color='#B5C0CB';
      document.getElementsByClassName('didd')[0].style.fontSize= 16+'px';
      document.getElementsByClassName('didd')[0].style.fontFamily= 'PingFang SC';
    },
    methods: {
      copy(n){
        var clipboard = new Clipboard('.tag-read');
        clipboard.on('success', e => {
          MessageBox({
            type: "success",
            duration: 2000,
            message: "复制成功",
          });   //这里你如果引入了elementui的提示就可以用，没有就注释即可
          // 释放内存
          document.getElementsByClassName('mint-msgbox')[0].style.height=129+ 'px';
          clipboard.destroy()
        });
        clipboard.on('error', e => {
          // 不支持复制
          console.log('该浏览器不支持自动复制');
          // 释放内存
          clipboard.destroy()
        })
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
    .market {
      background: #fff;
      display: block;
      position: absolute;
      font-size:28px;
      font-family:PingFang-SC-Medium;
      color:rgba(128,135,142,1);
      top: 0px;
      right: 20px;
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
    img {
      position: absolute;
      width: 16px;
      height: 31px;
      top:50px;
      right: 49px;
    }
  }
  #msg {
  }
  .p1 {
    font-size:30px;
    font-family:PingFang-SC-Medium;
    color:rgba(50,145,235,1);
    text-align: center;
    margin-top: 36px;
    background: #fff;
    border:none;
  }
  .p4 {
    margin-left: 42%;
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
    color:rgba(181,192,203,1);
  }
  .p3 {
    font-size:24px;
    font-family:PingFang SC;
    color:#B5C0CB;
    margin-left: 30px;
    line-height: 54px;
    margin-top: 20px;
  }
  .didd {
    p {
      font-size:24px;
      font-family:PingFang SC;
      color:#B5C0CB;
      margin-left: 30px;
      line-height: 54px;
      margin-top: 20px;
    }
  }
</style>
