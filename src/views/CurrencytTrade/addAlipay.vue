<template>
  <div class="container">
    <div class="headCon">
      <span class="goBack" @click="goBack"></span>
    </div>
    <section class="main">
      <div class="m-tit">添加支付宝</div>
      <form ref="form" enctype="multipart/form-data">
        <div class="con">
          <div class="con-i"><label>姓名</label><input style="color:#50565c;" disabled type="text" placeholder="请输入姓名"
                                                     v-model="TrueName"></div>
          <div class="con-i"><label>支付宝号</label><input type="text" placeholder="请输入支付宝账号" v-model="AlipayAccount"></div>
          <div class="con-i"><label>绑定手机</label><input type="number" placeholder="请输入支付宝绑定手机号" v-model="Alipaymobile">
          </div>
          <div class="con-i"><label>备注</label><input type="text" placeholder="请设置备注名称" v-model="Remark"></div>
        </div>
        <div class="upload-c">
          <p class="u-t">上传支付宝个人信息截图 <span></span></p>
          <div class="u-l">
            <div class="u-l-i">
              <a href="javascript:void (0);" class="u-camera"></a>
              <input type="file" class="uploadInput" @change="onFileChange($event)" ref="updataInput">
            </div>
            <div class="u-l-p">
              <img :src="url" alt="">
            </div>
          </div>
        </div>
      </form>
      <div>
        <mt-button type="primary" size="large" class="btn" @click="save">保存</mt-button>
      </div>
    </section>

    <!--弹窗-->
    <mt-popup
      v-model="popupVisible"
      position="bottom"
      class="popupVisible">
      <div>
        <div class="popup-tit">
          <span class="pop-tit">请输入资金密码</span> <span class="cancel" @click="popupVisible=false;">取消</span>
        </div>
        <div class="moneyPassword">
          <input type="password" placeholder="请输入资金密码" class="password" v-model="safePwd">
        </div>
        <div class="popBtn">
          <a href="javascript:void (0)" class="forgetPassword">忘记密码？</a>
          <mt-button class="sureBtn" type="primary" size="large" @click="sure(1)">确定</mt-button>
        </div>
      </div>
    </mt-popup>
    <mt-popup
      v-model="popupVisibleIcon"
      class="popupVisibleQuery">
      <div class="popup-tit">提示</div>
      <div class="popup-con">请您先在PC端进行实名认证才能添加银行卡</div>
      <div class="popBtn" @click="popupVisibleIcon=false;">知道了</div>
    </mt-popup>
  </div>
</template>
<script type="text/babel">
  import {AddPaymentMethod, Upload, GetUserInfo} from "@/service/CurrencytTrade";
  import countDown from '@/components/countDown';
  import {createNamespacedHelpers} from "vuex";
  import Verification from "@/assets/js/Verification";
  const {mapState, mapMutations} = createNamespacedHelpers("pairs");
  import {InfiniteScroll, Popup, Toast} from 'mint-ui';
  import {imgBaseUrl} from '@/config/nev' // imgBaseUrl
  export default {
    data(){
      return {
        popupVisible: false,   //输入资金密码弹窗
        popupVisibleIcon: false,   //提示弹窗
        TrueName: '',   //输入姓名
        url: '',   //图片路径
        Remark: "",   //备注
        safePwd: "",   //资金密码
        AlipayIImg: "",   //支付宝图片
        AlipayAccount: "",   //支付宝账号
        Alipaymobile: "",   //支付宝绑定手机号
        UserInfo: {   //用户详情
          FullName: ''
        },
        imgBaseUrl: ''   //图片路径前缀
      }
    },
    i18n: {
      messages: {
        "zh-CN": {
          header: "公告列表"
        },
        "en-US": {
          header: "notice"
        }
      }
    },
    mounted(){
      this.imgBaseUrl = imgBaseUrl;
      this.getUserInfo();
    },
    methods: {
      ...mapMutations([
        'setTheme'
      ]),
      getUserInfo() {   //获取用户详情
        let option = {}; // 参数
        const res = GetUserInfo(option); // 调用请求传参
        res.then(data => {   // 成功
          this.UserInfo = data.Data;
          this.TrueName = this.UserInfo.FullName;
        });
        res.catch(err => {  // 失败
          console.log(err);
        });
      },
      onFileChange(){   //上传图片方法
        var self = this;
        let fileObj = self.$refs.updataInput.files;
        var isUpdate = true;
        for (var i = 0; i < fileObj.length; i++) {
          console.log(fileObj[i].type);
          if (fileObj[i].type != 'image/png' && fileObj[i].type != 'image/gif' && fileObj[i].type != 'image/jpeg') {
            isUpdate = false;
            break;
          }
        }
        if (isUpdate) {
          let form = new FormData();
          form.append('file', fileObj[0]);
          this.upLoad(form);
        } else {
          this.$toast({
            message: "只能上传图片！",
            duration: 1000
          });
        }

      },
      upLoad(form) {   //上传图片请求接口
        let self = this;
        let option = form; // 参数
        const res = Upload(option); // 调用请求传参
        res.then(data => {
          // 成功
          if (Verification.handleData(data)) {
            this.AlipayIImg = data.Data.FileUrl;
            this.url = self.imgBaseUrl + this.AlipayIImg;
          }
        });
        res.catch(err => {
          // 失败
          console.log(err);
        });
      },
      save(){    //点击保存，资金密码弹窗显示（条件判断）
        if (!this.AlipayAccount) {
          this.$toast({
            message: "支付宝账号不能为空！",
            duration: 2000,
            position: 'top'
          });
          return false;
        }
        if (!this.Alipaymobile) {
          this.$toast({
            message: "手机号码不能为空！",
            duration: 2000,
            position: 'top'
          });
          return false;
        }
        if (!this.AlipayIImg) {
          this.$toast({
            message: "支付宝信息截图不能为空！",
            duration: 2000,
            position: 'top'
          });
          return false;
        }
        if (!Verification.isPhoneNum(this.Alipaymobile)) {
          this.$toast({
            message: "输入的手机号码格式有误！",
            duration: 2000,
            position: 'top'
          });
          return false;
        }
        this.popupVisible = true;
      },
      sure() {   //添加支付宝
        this.popupVisible = false;
        if (!this.safePwd) {
          this.$toast({
            message: "资金密码不能为空！",
            duration: 1000
          });
          return false;
        }
        let option = {
          PaymentType: "Alipay",
          Remark: this.Remark,
          safePwd: this.safePwd,
          AlipayIImg: this.AlipayIImg,
          AlipayAccount: this.AlipayAccount,
          Alipaymobile: this.Alipaymobile
        }; // 参数
        const res = AddPaymentMethod(option); // 调用请求传参
        res.then(data => {
          this.safePwd = '';
          // 成功
          if (Verification.handleData(data)) {
            this.$router.push('/receivingSet');
          }
        });
        res.catch(err => {
          this.safePwd = '';
          // 失败
          console.log(err);
        });
      },
      goBack(){   //返回按钮
        this.$router.back();
      },
      setDefaultLanguage() {
        const cookieLanguage = this.$_cookie.get("language");
        if (cookieLanguage) {
          this.setLanguage(cookieLanguage);
        } else {
          this.setLanguage("zh-CN");
        }
      },
      // 设置语言
      setLanguage(language) {
        switch (language) {
          case "zh-CN":
            this.$i18n.locale = "zh-CN";
            this.$_cookie.set("language", "zh-CN");
            break;
          case "en-US":
            this.$i18n.locale = "en-US";
            this.$_cookie.set("language", "en-US");
            break;
          default:
            break;
        }
      },
      set (themeName) {
        this.setTheme(themeName)
        localStorage.setItem('theme', themeName)
      }
    },
    computed: {
      ...mapState([
        'theme',
      ])
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

  .popupVisible {
    width: 100%;
    height: 450px;
    input {
      border: none;
      outline: none;
      background: none;
    }
    .popup-tit {
      border-bottom: 2px solid #CFD6DB;
      padding: 30px 30px 26px;
      .pop-tit {
        font-size: 32px;
        font-family: PingFang-SC-Heavy;
        font-weight: 600;
        color: #0E304C;
      }
      .cancel {
        font-size: 26px;
        font-family: PingFang-SC-Medium;
        font-weight: 500;
        color: #ADB7C1;
        float: right;
      }
    }
    .moneyPassword {
      font-size: 26px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(173, 183, 193, 1);
      margin-top: 60px;
      margin-left: 30px;
      margin-right: 30px;
      border-bottom: 2px solid #CFD6DB;
      .password {
        font-size: 26px;
        padding: 16px;
        width: 100%;
      }
    }
    .forgetPassword {
      font-size: 24px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(50, 145, 235, 1);
    }
    .popBtn {
      margin: 30px;
      text-align: right;
      .sureBtn {
        margin-top: 46px;
        height: 80px;
        font-size: 30px;
        font-family: PingFang-SC-Bold;
        letter-spacing: 10px;
        background-color: #3291EB;
      }
    }
  }

  .popupVisibleQuery {
    width: 600px;
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

  .main {
    padding: 30px;
    .m-tit {
      font-size: 50px;
      font-family: PingFang-SC-Bold;
      font-weight: 600;
      color: rgba(14, 48, 76, 1);
    }
    .con {
      .con-i {
        display: flex;
        font-family: PingFang-SC-Medium;
        padding-bottom: 20px;
        margin-top: 69px;
        border-bottom: 2px solid #EEF2F5;
        label {
          flex: 1;
          font-size: 30px;
          color: #4A647A;
        }
        input {
          flex: 4;
          font-size: 30px;
          color: #0E304C;
          border: none;
          outline: none;
          background: #fff;
          /*appearance:none;*/
          -webkit-appearance: none;
          -webkit-tap-highlight-color: #fff;
        }
      }
      &::-webkit-input-placeholder {
        /* WebKit browsers */
        color: #adb7c1;
      }
      &:-moz-placeholder {
        /* Mozilla Firefox 4 to 18 */
        color: #adb7c1;
      }
      &::-moz-placeholder {
        /* Mozilla Firefox 19+ */
        color: #adb7c1;
      }
      &:-ms-input-placeholder {
        /* Internet Explorer 10+ */
        color: #adb7c1;
      }
    }
    .upload-c {
      .u-t {
        font-size: 30px;
        font-family: PingFang-SC-Medium;
        font-weight: 500;
        color: #4A647A;
        margin-top: 74px;
        span {
          display: inline-block;
          width: 27px;
          height: 27px;
          margin-left: 20px;
          @include bg-icon('iconQuery.png', 35px);
          vertical-align: middle;
        }
      }
      .u-l {
        margin-top: 31px;
        display: flex;
        .u-l-i {
          display: inline-block;
          width: 140px;
          height: 140px;
          background: #F7F9FC;
          margin-right: 10px;
          position: relative;
          .u-camera {
            position: absolute;
            top: 46px;
            left: 46px;
            width: 56px;
            height: 48px;
            @include bg-icon('iconCamera.png', 56px, 48px);
          }
          .uploadInput {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            opacity: 0;
            -ms-filter: 'alpha(opacity=0)';
          }
        }
        .u-l-p {
          display: inline-block;
          width: 140px;
          height: 140px;
          background-color: #fff;
          border: 1px dashed rgba(173, 183, 193, 1);
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .btn {
      margin-top: 46px;
      height: 86px;
      line-height: 86px;
      font-size: 30px;
      font-family: PingFang-SC-Medium;
      color: #fff;
      background: #3291EB;
      border-radius: 4px;
    }
  }

</style>
