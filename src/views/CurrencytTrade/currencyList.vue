<template>
  <div>
    <div class="headCon">
      <span class="goBack" @click="goBack"></span>
      <span>币种列表</span>
    </div>
    <ul>
      <li v-for="(item, index) in list" @click="checkFn(item.CoinInfo.CoinUnit)">
        <span> {{item.CoinInfo.CoinUnit}}</span>
        <span :class="{bg:bg == item.CoinId}"></span>
      </li>
    </ul>
  </div>
</template>
<script type="text/babel">
  import TheFooter from '@/components/footer'
  import {GetUserAsset} from "@/service/CurrencytTrade";
  import {createNamespacedHelpers} from "vuex";
  import Verification from "@/assets/js/Verification";
  const {mapState, mapMutations} = createNamespacedHelpers("pairs");
  import {Toast} from 'mint-ui';
  export default {
    name: "currencyList",
    data () {
      return {
        msg: "currencyList",
        list: [],
        bg: '',
        PageIndex: 1,
        PageSize: 100
      }

    },
    mounted(){
      this.getData();
    },
    i18n: {
      messages: {
        "zh-CN": {
          lang: "中文",

        },
        "en-US": {
          lang: "English",
        }
      }
    },
    methods: {
      ...mapMutations([
        'setTheme'
      ]),
      getData() {   //获取币种列表
        let option = {}; // 参数
        const res = GetUserAsset(option); // 调用请求传参
        res.then(data => {
          // 成功
          if (Verification.handleData(data)) {
            this.list = data.Data;
//            console.log(this.list);
          }
        });
        res.catch(err => {
          // 失败
          console.log(err);
        });
      },
      cancel(){
        this.$router.push({path: '/accountFiat'});
      },
      goBack(){   //返回按钮
        this.$router.push({path: '/accountFiat'});
      },
      checkFn (item) {   //选择币种跳转到资金划转页面
        this.bg = item.CoinId;
        setTimeout(() => {
          this.$router.push({path: '/transferFunds', query: {unit: item}});
        }, 300)
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
      },
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

  .con {
    height: 88px;
    line-height: 88px;
    padding: 0px 33px 0px 33px;
    box-shadow: 0px 6px 12px 0px rgba(197, 210, 229, 0.27);
    img {
      width: 30px;
      height: 30px;
    }
    input {
      height: 88px;
      border: none;
      outline: none;
      font-size: 28px;
      margin-left: 25px;
    }
    span {
      float: right;
      font-size: 28px;
      font-family: PingFang-SC-Medium;
      color: rgba(74, 100, 122, 1);
    }
  }

  ul {
    padding: 31px 30px;
    li {
      height: 80px;
      font-size: 34px;
      font-family: PingFang-SC-Bold;
      color: #0E304C;
      display: flex;
      span:first-child {
        flex: 6;
      }
      span:last-child {
        flex: 1;
      }
      .bg {
        width: 30px;
        height: 26px;
        @include bg-icon('dui.png', 30px, 26px);
      }
    }

  }
</style>
