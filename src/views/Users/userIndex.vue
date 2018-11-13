<template>
    <div class="container">
        <header>
            <p class="title">我的账户</p>
            <p class="back" @click="back"></p>
            <div class="userMsg">
                <p class="headImg" v-if="headerImg == ''"></p>
                <img v-else :src="headerImg">
                <p class="account">{{account}}</p>
            </div>
        </header>
        <section>
            <div class="cell">
                <p>
                    <span class="iconPhone"></span>
                    <span class="tips">手机验证</span>
                </p>
                <p v-if="status.IsMobile">
                    <span class="bind">已绑定</span>
                </p>
                <p v-else @click="routerTo('/modifyPhone','bind')">
                    <span class="Notes">绑定</span>
                    <span class="Forward"></span>
                </p>
            </div>
            <div class="cell">
                <p>
                    <span class="iconEmail"></span>
                    <span class="tips">邮箱验证</span>
                </p>
                <p v-if="status.IsEmail">
                    <span class="bind">已绑定</span>
                </p>
                <p v-else @click="routerTo('/modifyEmail','bind')">
                    <span class="Notes">绑定</span>
                    <span class="Forward"></span>
                </p>
            </div>
            <div class="cell">
                <p>
                    <span class="iconPass"></span>
                    <span class="tips">登录密码</span>
                </p>
                <p @click="routerTo('/ModifyPassword','modifySafe')">
                    <span class="Notes">修改</span>
                    <span class="Forward"></span>
                </p>
            </div>
            <div class="cell">
                <p>
                    <span class="iconSafe"></span>
                    <span class="tips">资金密码</span>
                </p>
                <p v-if="status.IsSafePwd" @click="routerTo('/ModifySafe','modify')">
                    <span class="Notes">修改</span>
                    <span class="Forward"></span>
                </p>
                <p v-else @click="routerTo('/ModifySafe','set')">
                    <span class="Notes">设置</span>
                    <span class="Forward"></span>
                </p>
            </div>
            <div class="line"></div>
            <div class="cell">
                <p>
                    <span class="iconLower"></span>
                    <span class="tips">初级认证</span>
                </p>
                <p v-show="status.IdentifyStatus == 0" @click="popupVisible = true">
                    <span class="Notes">认证</span>
                    <span class="Forward"></span>
                </p>
                <!-- <p>
                    <span class="loading">审核中</span>
                </p> -->
                <p v-show="status.IdentifyStatus >= 1">
                    <span class="Certified"></span>
                </p>
            </div>
            <div class="cell">
                <p>
                    <span class="iconSenior"></span>
                    <span class="tips">高级认证</span>
                </p>
                <p v-show="status.IdentifyStatus != 3 && status.IdentifyStatus != 2" @click="popupVisible = true">
                    <span class="Notes">认证</span>
                    <span class="Forward"></span>
                </p>
                <p v-show="status.IdentifyStatus == 3">
                    <span class="loading">审核中</span>
                </p>
                <p v-show="status.IdentifyStatus == 2">
                    <span class="Certified"></span>
                </p>
            </div>
        </section>

        <mt-popup
            v-model="popupVisible"
            position="center">
            <div class="dialog">
                <div class="top">
                    <p class="title">实名认证</p>
                    <p class="tips">请前往电脑端www.appleusdt.com进行认证。</p>
                </div>
                <div class="bottom" @click="popupVisible = false">
                    知道了
                </div>
            </div>
        </mt-popup>
    </div>
</template>
<script>
import Verification from "@/assets/js/Verification";
import { getUserMsg } from "@/service/account";
export default {
  data() {
    return {
      cookieLanguage: "zh-CN",
      popupVisible: false,
      status: {},
      account: "",
      headerImg: ""
    };
  },
  i18n: {
    messages: {
      "zh-CN": {
        header: "系统设置"
      },
      "en-US": {
        header: "System setup"
      }
    }
  },
  mounted() {
    this.getUserMsg();
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    routerTo(url, type) {
      this.$router.push({ path: url, query: { type: type } });
    },
    getUserMsg() {
      const res = getUserMsg();
      res.then(data => {
        if (Verification.handleData(data)) {
          this.status = data.Data;
          this.account = data.Data.PhoneNumber != "" ? data.Data.PhoneNumber : data.Data.Email;
          this.headerImg = data.Data.Avatar;
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
  header {
    width: 750px;
    height: 288px;
    background: linear-gradient(
      0deg,
      rgba(58, 148, 233, 1),
      rgba(58, 117, 253, 1)
    );
    box-shadow: 0px 5px 10px 0px rgba(4, 22, 59, 0.2);
    text-align: center;
    line-height: 95px;
    font-size: 34px;
    color: #fff;
    .title {
      font-size: 34px;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
    }
    .back {
      @include bg-icon("back_white.png", 35px, 27px);
      position: absolute;
      top: 32px;
      left: 29px;
    }
    .userMsg {
      display: flex;
      height: 80px;
      align-items: center;
      margin: 65px 30px 45px 30px;
      .headImg {
        @include bg-icon("headImg.png", 80px);
      }
      img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
      }
      .account {
        margin-left: 21px;
        font-size: 36px;
        font-weight: 800;
        color: rgba(255, 255, 255, 1);
      }
    }
  }
  section {
    margin-top: 31px;
    .line {
      height: 30px;
    }
    .cell {
      width: 690px;
      height: 124px;
      margin: 0 30px;
      border-bottom: 1px solid #eef2f5;
      display: flex;
      justify-content: space-between;
      align-items: center;
      p {
        font-size: 30px;
        color: #0e304c;
        display: flex;
        align-items: center;
        font-family: PingFang-SC-Medium;
        .tips {
          margin-left: 34px;
          font-size: 32px;
          font-weight: 500;
          color: rgba(14, 48, 76, 1);
        }
        .bind {
          font-size: 32px;
          font-weight: 500;
          color: rgba(128, 135, 142, 1);
        }
        .Notes {
          font-size: 32px;
          font-weight: 500;
          color: rgba(50, 145, 235, 1);
          margin-right: 20px;
        }
        .loading {
          font-size: 32px;
          font-weight: 500;
          color: rgba(128, 135, 142, 1);
        }
        .Forward {
          display: block;
          @include bg-icon("Forward.png", 17px, 29px);
        }
        .iconPhone {
          @include bg-icon("icon_phone.png", 37px, 43px);
        }
        .iconEmail {
          @include bg-icon("icon_email.png", 37px, 27px);
        }
        .iconPass {
          @include bg-icon("icon_pass.png", 37px, 44px);
        }
        .iconSafe {
          @include bg-icon("icon_safe.png", 37px, 44px);
        }
        .iconLower {
          @include bg-icon("icon_lower.png", 37px, 42px);
        }
        .iconSenior {
          @include bg-icon("icon_senior.png", 37px, 42px);
        }
        .Certified {
          @include bg-icon("icon_certified.png", 116px, 37px);
        }
      }
    }
  }
  .dialog {
    width: 540px;
    height: 292px;
    background: rgba(247, 249, 252, 1);
    border-radius: 4px 4px 0px 0px;
    .top {
      padding: 26px 45px;
      border-bottom: 1px solid #cfd6db;
      .title {
        margin: 16px 0;
        font-size: 34px;
        font-weight: 800;
        color: rgba(14, 48, 76, 1);
        text-align: center;
      }
      .tips {
        margin-top: 8px;
        font-size: 28px;
        font-weight: 500;
        color: rgba(14, 48, 76, 1);
        text-align: center;
        line-height: 42px;
      }
    }
    .bottom {
      font-size: 34px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(50, 145, 235, 1);
      text-align: center;
      line-height: 68px;
    }
  }
}
</style>
