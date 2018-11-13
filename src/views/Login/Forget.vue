<template>
    <div class="container">
        <header-back></header-back>
        <section>
            <div class="title ">找回密码</div>
            <input type="text" placeholder="手机号码/邮箱账号" v-model="account">
            <div class="colume">
                <input type="text" placeholder="验证码" v-model="code">
                <span v-if="isMsgCode" @click="getMsgCode()">获取验证码</span>
                <span v-else>{{timeDown}}秒后获取</span>
            </div>
            <input type="password" placeholder="6~20位，包括数字、大小写字母、特殊字符" v-model="password">
            <input type="password" placeholder="确认登录密码" v-model="confirmPassword">
            <div class="button" @click="DoForgotLoginPwd">提交</div>
        </section>
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
    </div>
</template>
<script>
import headerBack from "@/components/headerBack";
import Verification from "@/assets/js/Verification";
import { getImgCode, getMessageCode, DoForgotLoginPwd } from "@/service/account";
export default {
  data() {
    return {
      popupVisible: false,
      imgKey: "",
      imgUrl: "",
      imgCode:'',
      code: "",
      account: "",
      password: "",
      confirmPassword: "",
      isMsgCode: true,
      timeDown: 60, // 倒计时
    };
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
  components: { headerBack },
  mounted() {},
  methods: {
    getMsgCode() {
      if (this.account == '') {
        this.$toast({
          message: "账号不能为空！",
          duration: 2000
        });
        return false;
      }
      if (
        !Verification.isPhoneNum(this.account) &&
        !Verification.isEmail(this.account)
      ) {
        this.$toast({
          message: "输入的账号格式有误！",
          duration: 2000
        });
        return false;
      }
      this.imgCode = ''
      this.popupVisible = true;
      this.getImgCode();
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

      let options = {
        Account: this.account,
        ImgCode: this.imgCode,
        ImageCodeType: "ForgotLoginPwd",
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
      res.catch(error => {});
    },
    getImgCode() {
      let options = {
        type: "ForgotLoginPwd"
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
    DoForgotLoginPwd(){
      if (this.account == '') {
        this.$toast({
          message: "请输入账号！",
          duration: 2000
        });
        return false;
      }
      if (
        !Verification.isPhoneNum(this.account) &&
        !Verification.isEmail(this.account)
      ) {
        this.$toast({
          message: "输入的账号格式有误！",
          duration: 2000
        });
        return false;
      }
      if (this.password.length < 6) {
        this.$toast({
          message: "密码长度不能小于6位！",
          duration: 2000
        });
        return false;
      }
      if (this.password.length > 20) {
        this.$toast({
          message: "密码长度不能大于20位！",
          duration: 2000
        });
        return false;
      }
      if (this.password != this.confirmPassword) {
        this.$toast({
          message: "两次输入密码不一致！",
          duration: 2000
        });
        return false;
      }
      if (this.code == "") {
        this.$toast({
          message: "验证码不能为空！",
          duration: 2000
        });
        return false;
      }

      let options = {
        Account: this.account,
        AreaCode: 86,
        VerifyCode: this.code,
        LoginPwd: this.password,
        ImgCode: this.imgCode,
        ImageCodeKey: this.imgKey
      };
      const res = DoForgotLoginPwd(options);
      res.then(data => {
        if (Verification.handleData(data)) {
          this.$toast({
            message: "密码重置成功！",
            duration: 2000
          });
          this.$router.push({ path: "/Login" });
        }
      });
      res.catch(error => {});
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/design/scoped";
.container {
  padding: 0 60px;
  section {
    margin-top: 111px;
    .title {
      font-size: 52px;
      font-weight: bold;
      color: rgba(14, 48, 76, 1);
    }
    .tips {
      font-size: 28px;
      font-weight: 500;
      color: rgba(173, 183, 193, 1);
      margin: 15px 0 72px 0;
    }
    input {
      width: 100%;
      height: 40px;
      margin-top: 60px;
      border: none;
      font-size: 26px;
      border-bottom: 2px solid #cfd6db;
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
      &:focus {
        outline: none;
      }
    }
    .button {
      width: 630px;
      height: 80px;
      margin-top: 103px;
      background: $blue;
      border-radius: 4px;
      color: #fff;
      font-size: 28px;
      text-align: center;
      line-height: 80px;
    }
    a {
      display: block;
      margin: 42px 0;
      font-size: 24px;
      font-weight: 500;
      color: $blue;
    }
    .colume {
      position: relative;
      span {
        position: absolute;
        bottom: 12px;
        right: 9px;
        font-size: 26px;
        font-weight: 500;
        color: rgba(50, 145, 235, 1);
      }
    }
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
}
</style>
