<!-- 首页 -->
<template>
  <div class="contor">
    <header>
      <div class="logo" v-show="!loginStaus"></div>
      <router-link to="/UserIndex" class="message" v-show="loginStaus">
        <p class="img" v-if="headerImg == ''"></p>
        <img v-else :src="headerImg">
        <p class="account">{{account}}</p>
      </router-link>
      <router-link to="/SetUp" class="setUp"></router-link>
    </header>
    <section>
      <mt-swipe :auto="2000">
        <mt-swipe-item v-for="(item,index) in swipes" :key="index">
          <a :href="item.link" rel="external nofollow" >
            <img :src="item.Img" class="img"/>
          </a>
        </mt-swipe-item>
      </mt-swipe>
      <news></news>
      <my-assets></my-assets>
      <div class="line">
        <quotation></quotation>
      </div>
    </section>
    <the-footer></the-footer>
  </div>
</template>

<script>
import TheFooter from "@/components/footer";
import News from "./news";
import MyAssets from "./myAssets";
import Quotation from "./Quotation";
import Verification from "@/assets/js/Verification";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("pairs");
import { getBanners } from "@/service/index";

export default {
  name: "index",
  data() {
    return {
      account: "",
      headerImg:'',
      swipes: []
    };
  },
  i18n: {
    messages: {
      "zh-CN": {
        lang: "中文"
      },
      "en-US": {
        lang: "English"
      }
    }
  },
  components: {
    TheFooter,
    News,
    MyAssets,
    Quotation
  },
  mounted() {
    this.getUserMsg();
    this.getBanners()
  },
  methods: {
    ...mapMutations(['updateLoginStaus']),
    getUserMsg(){
      let UserInfo = JSON.parse(localStorage.getItem('UserInfo'));
      if (UserInfo != null) {
        this.account = UserInfo.PhoneNumber
          ? Verification.regMobile(UserInfo.PhoneNumber)
          : Verification.regEmail(UserInfo.Email);
        this.headerImg = UserInfo.Avatar
      }else {
        this.updateLoginStaus(false)
      }
    },
    getBanners(){
      const res = getBanners();
      res.then(data => {
        if (Verification.handleData(data)) {
          this.swipes = data.Data
        }
      });
      res.catch(error => {});
    }
  },
  computed: {
    ...mapState(["theme","loginStaus"])
  }
};
</script>

<style lang='scss' scoped>
@import "~@/design/scoped";
.contor {
  padding: 30px;
  background: #fff;
  header {
    padding: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .logo {
      @include bg-icon("header_logo.png", 184px, 74px);
    }
    .setUp {
      @include bg-icon("setUp.png", 38px);
    }
    .message {
      display: flex;
      align-items: center;
      .img {
        border-radius: 50%;
        @include bg-icon("headImg.png", 50px);
      }
      img{
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .account {
        font-size: 30px;
        margin-left: 23px;
        font-family: PingFang-SC-Bold;
        font-weight: bold;
        color: rgba(14, 48, 76, 1);
      }
    }
  }
  section {
    margin-top: 21px;
    .line{
      margin-top: 20px;
      margin-bottom: 60px;
    }
    img {
      width: 690px;
      height: 344px;
      border-radius: 4px;
    }
    .mint-swipe {
      width: 690px;
      height: 344px;
      border-radius: 4px;
    }
  }
}
</style>
<style>
.mint-swipe-indicator {
  width: 50px;
  height: 2px;
  background: #747474;
}
.mint-swipe-indicator.is-active {
  background: rgba(50, 145, 235, 1);
}
</style>
