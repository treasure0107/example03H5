<template>
    <div class="container">
        <header>
            <p><router-link to="/">取消</router-link></p>
            <p><router-link to="/Register">注册</router-link></p>
        </header>
        <section>
            <div class="logo"></div>
            <p class="tips">登录苹果数字资产交易平台</p>
            <input type="text" placeholder="手机号码/邮箱账号" v-model="account" @blur="accountBlur">
            <input type="password" placeholder="密码" v-model="password">
            <div class="center">
              <input type="text" placeholder="图形验证码" v-model="imgCode">
              <img :src="imgUrl" @click="getImgCode">
            </div>
            <div class="colume" v-show="isMsgCode">
                <input type="text" placeholder="验证码" v-model="code">
                <span v-if="isMsgCodeDown" @click="getMsgCode()">获取验证码</span>
                <span v-else>{{timeDown}}秒后获取</span>
            </div>
            <input type="text" placeholder="谷歌验证码" v-model="googleCode" v-show="isGoogle">
            <div class="button" @click="login">登录</div>
            <router-link to="/Forget">忘记密码</router-link>
        </section>
    </div>
</template>
<script>
import headerBack from "@/components/headerBack";
import {
  getImgCode,
  login,
  GetLoginStrategy,
  getMessageCode
} from "@/service/account";
import { createNamespacedHelpers } from "vuex";
const { mapMutations } = createNamespacedHelpers("pairs");
import Verification from "@/assets/js/Verification";
import "@/assets/js/hubs";
export default {
  data() {
    return {
      imgKey: "",
      imgUrl: "",
      imgCode: "",
      account: "",
      password: "",
      googleCode: "",
      isGoogle: false,
      isMsgCode: false,
      isMsgCodeDown: true,
      code: "",
      timeDown: 60
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
  mounted() {
    this.getImgCode();
  },
  methods: {
    ...mapMutations(["updateLoginStaus"]),
    getImgCode() {
      let options = {
        type: "Login"
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
    getMsgCode() {
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
        ImageCodeType: "Login",
        ImageCodeKey: this.imgKey
      };
      const res = getMessageCode(options);
      res.then(data => {
        if (Verification.handleData(data)) {
          this.$toast({
            message: "验证码发送成功！",
            duration: 2000
          });
          let timer = setInterval(() => {
            this.timeDown--;
            if (this.timeDown == 0) {
              this.isMsgCodeDown = true;
              this.timeDown = 60;
              clearInterval(timer);
            }
          }, 1000);
        }
      });
      res.catch(error => {});
    },
    accountBlur() {
      if (
        !Verification.isPhoneNum(this.account) &&
        !Verification.isEmail(this.account)
      ) {
        return false;
      }

      let options = {
        Account: this.account,
        AreaCode: 86
      };
      const res = GetLoginStrategy(options);
      res.then(data => {
        if (Verification.handleData(data)) {
          this.isGoogle = data.Data.IsGoogleCode;
          this.isMsgCode = data.Data.IsMsgCode;
        }
      });
      res.catch(error => {});
    },
    login() {
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
      if (this.password.length == 0) {
        this.$toast({
          message: "密码不能为空！",
          duration: 2000
        });
        return false;
      }
      if (this.password.length < 6) {
        this.$toast({
          message: "密码不能小于6位！",
          duration: 2000
        });
        return false;
      }
      if (this.password.length > 20) {
        this.$toast({
          message: "密码不能大于20位！",
          duration: 2000
        });
        return false;
      }
      if (this.imgCode.length == 0) {
        this.$toast({
          message: "图形验证码不能为空！",
          duration: 2000
        });
        return false;
      }
      if (this.isGoogle) {
        if (this.googleCode == "") {
          this.$toast({
            message: "谷歌验证码不能为空！",
            duration: 2000
          });
          return false;
        }
      }
      if (this.isMsgCode) {
        if (this.code == "") {
          this.$toast({
            message: "短信/邮箱验证码不能为空！",
            duration: 2000
          });
          return false;
        }
      }

      // 登录请求
      let options = {};
      if (this.isGoogle) {
        options = {
          Account: this.account,
          LoginPwd: this.password,
          ImgCode: this.imgCode,
          ImageCodeKey: this.imgKey,
          GoogleCode: this.googleCode
        };
      } else if (this.isMsgCode) {
        options = {
          Account: this.account,
          LoginPwd: this.password,
          ImgCode: this.imgCode,
          ImageCodeKey: this.imgKey,
          VerifyCode: this.code
        };
      } else if (this.isMsgCode || this.isGoogle) {
        options = {
          Account: this.account,
          LoginPwd: this.password,
          ImgCode: this.imgCode,
          ImageCodeKey: this.imgKey,
          VerifyCode: this.code,
          GoogleCode: this.googleCode
        };
      } else {
        options = {
          Account: this.account,
          LoginPwd: this.password,
          ImgCode: this.imgCode,
          ImageCodeKey: this.imgKey
        };
      }
      const res = login(options);
      res.then(data => {
        if (Verification.handleData(data)) {
          localStorage.setItem("token", data.Data.Token);
          localStorage.setItem("UserInfo", JSON.stringify(data.Data));
          $.connection.hub.start().done(function() {
            $.connection.exchangeHub.server.register(data.Data.Token);
          });
          this.updateLoginStaus(true);
          this.$router.push({ path: "/" });
        } else {
          this.getImgCode();
        }
      });
      res.catch(error => {});
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/design/scoped";
.center {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
    margin-top: 50px;
    width: 120px;
    height: 60px;
  }
}
.container {
  padding: 0 60px;
  header {
    height: 88px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    p {
      font-size: 26px;
      font-weight: 500;
      &:nth-child(1) {
        a {
          color: #adb7c1;
        }
      }
      &:nth-child(2) {
        a {
          color: #3291eb;
        }
      }
    }
  }
  section {
    margin-top: 44px;
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
    .logo {
      @include bg-icon("logo.png", 274px, 68px);
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
  }
}
</style>
