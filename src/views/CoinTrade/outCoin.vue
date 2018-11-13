<template>
  <!-- 法币交易 -->
  <div class="content">
    <div class="header">
      <div class="header-con">
        <span class="goBack"  @click="goBack"></span>
        <div class="headerTitle">
          <div class="buySale">
            <span class="buy" :class="{ active: isActive }" @click="buy">提币</span>
            <span class="sale" :class="{ active: Active }" @click="sale">站内互转</span>
            <span class="buy" :class="{ active: tive }" @click="qwe" >划转</span>
          </div>
        </div>
      </div>
    </div>
    <div style="clear:both;height:0px;"></div>
    <div class="cont" @click="goChooseFn()">
      <span>选择币种</span>
      <!--<img src="~@/assets/icon-png/rig.png" alt="">-->
      <span class="img"></span>
    </div>
  </div>
</template>
<script>
import TheFooter from "@/components/footer";
import { getIndexData } from "@/service/CurrencytTrade";
import { getUserMsg } from "@/service/account";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("pairs");
import Verification from "@/assets/js/Verification";
import { InfiniteScroll, Popup } from "mint-ui";
export default {
  name: "currencytTrade",
  data() {
    return {
      msg: "currencytTrade",
      isActive: true,
      popupVisiblePay: false,
      popupVisibleSet: true,
      Active: false,
      tive: false,
      isUFE: false // 是否UFE用户
    };
  },
  components: {
    TheFooter
  },
  mounted() {
    this.getUserMessage();
    /*      this.getData();
       this.setDefaultLanguage();*/
  },
  methods: {
    ...mapMutations(["setTheme"]),
    cancel() {
      this.popupVisibleSet = false;
    },
    getUserMessage() {
      // 获取用户信息
      const res = getUserMsg();
      res.then(data => {
        if (Verification.handleData(data)) {
          this.isUFE = data.Data.IsToGfc;
        }
      });
    },
    goBack() {
      this.$router.push({ path: "/accountCoin" });
    },
    goChooseFn() {
      if (this.isActive) {
        this.$router.push("/serCoin?type=1");
      } else if (!this.isActive && !this.Active) {
        this.$router.push("/serCoin?type=4");
      } else {
        this.$router.push("/serCoin?type=2");
      }
    },
    buy() {
      this.isActive = true;
      this.Active = false;
      this.tive = false;
    },
    sale() {
      this.isActive = false;
      this.Active = true;
      this.tive = false;
    },
    qwe() {
      this.isActive = false;
      this.Active = false;
      this.tive = true;
    },
    getData() {
      let option = {
        pageIndex: 1
      }; // 参数
      const res = getIndexData(option); // 调用请求传参
      res.then(data => {
        if (Verification.handleData(data)) {
        }
        // 成功
        // console.log(data);
      });
      res.catch(err => {
        // 失败
        console.log(err);
      });
    }
  },
  computed: {
    ...mapState([""])
  }
};
</script>
<style lang='scss' scoped>
@import "~@/design/scoped";
.content {
  .header {
    /*position: fixed;*/
    top: 0;
    left: 0;
    width: 100%;
    z-index: 9;
    /*height: 190px;*/
    background-color: #fff;
    box-shadow: 0px 6px 12px 0px rgba(197, 210, 229, 0.27);
    .header-con {
      width: 100%;
      height: 80px;
      font-family: PingFang-SC-Medium;
      margin-top: 35px;
      position: relative;
      .goBack {
        position: absolute;
        top: 18px;
        left: 30px;
        width: 30px;
        height: 30px;
        @include bg-icon("goBack.png", 30px);
        z-index: 1;
      }
    }
    .headerTitle {
      text-align: center;
      .buySale {
        height: 60px;
        line-height: 60px;
        font-size: 30px;
        display: inline-block;
        border: 1px solid #cfd6db;
        .buy,
        .sale {
          display: inline-block;
          width: 150px;
          height: 100%;
          text-align: center;
          color: #50565c;
        }
        .active {
          background-color: #3291eb;
          color: #fff;
        }
      }
    }

    .recordPic {
      position: absolute;
      left: 26px;
      top: 13px;
      @include bg-icon("recordPic.png", 35px);
    }
    .filterCondition {
      position: absolute;
      right: 26px;
      top: 13px;
      @include bg-icon("filterPic.png", 35px);
    }
  }
  .main {
    margin-top: 230px;
    background-color: #f7f9fc;
    width: 100%;
    margin-bottom: 60px;
    padding-bottom: 10px;
    ul li {
      padding-left: 30px;
      padding-right: 30px;
      background-color: #fff;
      margin-bottom: 20px;
      padding-bottom: 50px;
      .personNews {
        padding-top: 44px;
        .headPhoto {
          display: inline-block;
          width: 40px;
          height: 40px;
          background-color: #ccc;
          border-radius: 50%;
          vertical-align: middle;
        }
        .newsTit {
          font-size: 26px;
          font-family: PingFang-SC-Bold;
          font-weight: bold;
          color: #0e304c;
          margin: 0 10px;
        }
        .news {
          font-size: 24px;
          font-family: PingFang-SC-Bold;
          font-weight: bold;
          color: #adb7c1;
          .middleLine {
            font-size: 20px;
            position: relative;
            bottom: 3px;
          }
        }
        .alipayPic {
          display: inline-block;
          width: 35px;
          height: 35px;
          @include bg-icon("alipayPic.png", 35px);
          float: right;
          margin-left: 16px;
        }
        .bankCardPic {
          display: inline-block;
          width: 35px;
          height: 35px;
          @include bg-icon("bankCardPic.png", 35px);
          float: right;
          margin-left: 16px;
        }
      }
      .con {
        padding-top: 40px;
        margin-bottom: 20px;
        .conLeft,
        .conRight {
          float: left;
          font-size: 24px;
          font-family: PingFang-SC-Bold;
          color: #adb7c1;
        }
        .conRight {
          margin-left: 80px;
          p {
            margin-top: 6px;
          }
        }
        .price {
          font-size: 40px;
          font-family: PingFang-SC-Heavy;
          font-weight: 800;
          color: rgba(50, 145, 235, 1);
        }
      }
    }
  }

  .cont {
    background: #f7fbfc;
    height: 130px;
    line-height: 130px;
    margin-top: 37px;
    position: relative;
    padding-left: 30px;
    span {
      font-size: 38px;
      font-family: PingFang-SC-Medium;
      color: rgba(14, 48, 76, 1);
    }
    .img {
      position: absolute;
      width: 16px;
      height: 31px;
      top: 50px;
      right: 49px;
      @include bg-icon("rig.png", 35px);
    }
  }
}
</style>
