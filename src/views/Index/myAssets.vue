<template>
    <div class="container">
        <div class="noLogin" v-show="!loginStaus">
            <div>
                <p class="title">我的资产</p>
                <p class="tips">登录后可查看</p>
            </div>
            <router-link to="/Login" class="btn">登 录</router-link>
        </div>

        <div class="login" v-show="loginStaus">
            <div class="title">
                <p class="tips">我的资产</p>
                <p class="show" v-show="isShow" @click="assetsShow(false)"></p>
                <p class="hide" v-show="!isShow" @click="assetsShow(true)"></p>
            </div>
            <div class="coinList">
                <div class="coinDetail">
                    <p class="title" @click="$router.push('/accountCoin');">
                        <u>币币账户</u>
                        <span></span>
                    </p>
                    <p class="bottom">
                        <u v-show="isShow">{{Math.floor(Number(coinAssets)*100)/100}}</u>
                        <u v-show="!isShow">******</u>
                        <span>APPLE</span>
                    </p>
                </div>
                <div class="coinDetail">
                    <p class="title" @click="$router.push('/accountFiat')">
                        <u>法币账户</u>
                        <span></span>
                    </p>
                    <p class="bottom">
                        <u v-show="isShow">{{Math.floor(Number(currencyAssets)*100)/100}}</u>
                        <u v-show="!isShow">******</u>
                        <span>APPLE</span>
                    </p>
                </div>
                <!-- <div class="coinDetail">
                    <p class="title">
                        <u>合约账户</u>
                        <span></span>
                    </p>
                    <p class="bottom">
                        <u v-show="isShow">470730.06</u>
                        <u v-show="!isShow">******</u>
                        <span>APPLE</span>
                    </p>
                </div> -->
            </div>

        </div>
    </div>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("pairs");
import { getUserAssetList } from "@/service/index";
import Verification from "@/assets/js/Verification";
export default {
  name: "my-assets",
  data() {
    return {
      isShow: true,
      coinAssets: 0,
      currencyAssets: 0
    };
  },
  computed: {
    ...mapState(["loginStaus"])
  },
  mounted() {
    this.getCoinAsset();
  },
  methods: {
    assetsShow(type) {
      this.isShow = type;
    },
    getCoinAsset() {
      if(!localStorage.getItem('token')) return
      const res = getUserAssetList();
      res.then(data => {
        if (Verification.handleData(data)) {
          for (let i = 0; i < data.Data.length; i++) {
            if (data.Data[i].CoinId == 32) {
              this.coinAssets = data.Data[i].MarketAsset.Available;
              this.currencyAssets = data.Data[i].OTCAsset.Available;
            }
          }
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
  .noLogin {
    height: 176px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    div {
      .title {
        font-size: 32px;
        font-family: PingFang-SC-Bold;
        font-weight: bold;
        color: #0e304c;
      }
      .tips {
        margin-top: 21px;
        font-size: 26px;
        font-family: PingFang-SC-Medium;
        font-weight: 500;
        color: rgba(173, 183, 193, 1);
      }
    }
    .btn {
      text-align: center;
      font-size: 30px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(50, 145, 235, 1);
      line-height: 72px;
      @include bg-icon("loginIndex.png", 223px, 91px);
    }
  }
  .login {
    .title {
      height: 112px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .tips {
        font-size: 32px;
        font-family: PingFang-SC-Bold;
        font-weight: bold;
        color: rgba(13, 43, 71, 1);
      }
      .show {
        @include bg-icon("showIndex.png", 36px, 21px);
      }
      .hide {
        @include bg-icon("hideIndex.png", 36px, 21px);
      }
    }
    .coinList {
      width: 690px;
      // height: 341px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(244, 248, 251, 1);
      box-shadow: 0px 17px 24px 0px rgba(112, 150, 185, 0.16);
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      .coinDetail {
        width: 340px;
        height: 170px;
        border-bottom: 1px solid #f4f8fb;
        &:nth-child(1),
        &:nth-child(3) {
          border-right: 1px solid #f4f8fb;
        }
        .title {
          font-size: 26px;
          font-family: PingFang-SC-Medium;
          font-weight: 500;
          color: rgba(50, 145, 235, 1);
          display: flex;
          justify-content: flex-start;
          u {
            margin-left: 32px;
            text-decoration: none;
          }
          span {
            margin-left: 15px;
            @include bg-icon("index_into.png", 11px, 20px);
          }
        }
        .bottom {
          u {
            margin-left: 32px;
            text-decoration: none;
            font-size: 30px;
            font-family: PingFang-SC-Bold;
            font-weight: bold;
            color: rgba(14, 48, 76, 1);
          }
          span {
            font-size: 22px;
            font-family: PingFang-SC-Medium;
            font-weight: 500;
            color: rgba(128, 135, 142, 1);
          }
        }
      }
    }
  }
}
</style>
