<template>
    <div class="container">
        <header-back>{{$t('header')}}</header-back>
        <section>
            <!-- 费率详情 -->
            <div class="cell" @click="routerTo('/RateDetail')">
                <p>{{$t('rate')}}</p>
                <p>
                    <span class="Notes"></span>
                    <span class="Forward"></span>
                </p>
            </div>

            <!-- 语言切换 -->
            <!-- <div class="cell" @click="setLanguage('en-US')" v-if="cookieLanguage == 'zh-CN'">
                <p>{{$t('lang')}}</p>
                <p>
                    <span class="Notes">{{$t('language')}}</span>
                    <span class="Forward"></span>
                </p>
            </div>
            <div class="cell" @click="setLanguage('zh-CN')" v-else>
                <p>{{$t('lang')}}</p>
                <p>
                    <span class="Notes">{{$t('language')}}</span>
                    <span class="Forward"></span>
                </p>
            </div> -->

            <!-- 主题切换 -->
            <!-- <div class="cell" @click="setThemes('black')" v-if="theme == 'white'">
                <p>{{$t('theme')}}</p>
                <p>
                    <span class="Notes">{{$t('white')}}</span>
                    <span class="Forward"></span>
                </p>
            </div>
            <div class="cell" @click="setThemes('white')" v-else>
                <p>{{$t('theme')}}</p>
                <p>
                    <span class="Notes">{{$t('black')}}</span>
                    <span class="Forward"></span>
                </p>
            </div> -->
            
            <!-- 新手指导 -->
            <div class="cell" @click="routerTo('/Guide')">
                <p>新手指导</p>
                <p>
                    <span class="Notes"></span>
                    <span class="Forward"></span>
                </p>
            </div>

            <!-- 关于我们 -->
            <div class="cell" @click="routerTo('/AboutUs')">
                <p>{{$t('AboutUs')}}</p>
                <p>
                    <span class="Notes"></span>
                    <span class="Forward"></span>
                </p>
            </div>
        </section>
        <footer>
            <div class="button" v-if="loginStaus" @click="signOut">{{$t('SignOut')}}</div>
            <!-- <div class="button" v-else>{{$t('login')}}</div> -->
            <router-link class="button" to="/Login" v-else>{{$t('login')}}</router-link>
        </footer>
    </div>
</template>
<script>
import headerBack from "@/components/headerBack";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("pairs");
export default {
  data() {
    return {
      cookieLanguage: "zh-CN"
    };
  },
  i18n: {
    messages: {
      "zh-CN": {
        header: "系统设置",
        rate: "费率详情",
        lang: "语言",
        language: "中文",
        theme: "主题",
        AboutUs: "关于我们",
        login: "去登录",
        SignOut: "退出登录",
        white: "白天",
        black: "夜间"
      },
      "en-US": {
        header: "System setup",
        rate: "rate details",
        lang: "language",
        language: "English",
        theme: "theme",
        AboutUs: "About Us",
        login: "login",
        SignOut: "SignOut",
        white: "white",
        black: "black"
      }
    }
  },
  components: { headerBack },
  computed: {
    ...mapState(["loginStaus", "theme"])
  },
  mounted() {
    this.setDefaultLanguage();
    this.setDefaultTheme();
  },
  methods: {
    ...mapMutations(["setTheme", "updateLoginStaus"]),
    // 获取语言
    setDefaultLanguage() {
      this.cookieLanguage = this.$_cookie.get("language");
      if (this.cookieLanguage) {
        this.setLanguage(this.cookieLanguage);
      } else {
        this.setLanguage("zh-CN");
      }
    },
    // 设置语言
    setLanguage(language) {
      this.cookieLanguage = language;
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
    // 获取语言
    setDefaultTheme() {
      const theme = this.$_cookie.get("theme");
      if (theme) {
        this.setThemes(theme);
      } else {
        this.setThemes("white");
      }
    },
    // 设置语言
    setThemes(theme) {
      this.setTheme(theme);
      switch (theme) {
        case "white":
          this.$_cookie.set("theme", "white");
          break;
        case "black":
          this.$_cookie.set("theme", "black");
          break;
        default:
          break;
      }
    },
    routerTo(url) {
      this.$router.push({ path: url });
    },
    signOut() {
      localStorage.removeItem("token");
      localStorage.removeItem("UserInfo");
      this.updateLoginStaus(false);
      this.$router.push({ path: "/" });
      this.$toast({
        message: "退出成功",
        duration: 2000
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/design/scoped";
.container {
  section {
    margin-top: 111px;
    .cell {
      width: 720px;
      height: 124px;
      margin-left: 30px;
      border-bottom: 1px solid #efefef;
      display: flex;
      justify-content: space-between;
      align-items: center;
      p {
        font-size: 30px;
        color: #0e304c;
        display: flex;
        align-items: center;
        .Notes {
          display: block;
          font-size: 30px;
          color: #80878e;
          margin-right: 20px;
        }
        .Forward {
          display: block;
          margin-right: 30px;
          @include bg-icon("Forward.png", 17px, 29px);
        }
      }
    }
  }
  footer {
    width: 750px;
    position: absolute;
    bottom: 0;
    .button {
      display: block;
      width: 690px;
      height: 92px;
      margin: 48px auto;
      text-align: center;
      line-height: 92px;
      font-size: 30px;
      color: #3291eb;
      border: 2px solid rgba(50, 145, 235, 1);
      border-radius: 4px;
    }
  }
}
</style>
