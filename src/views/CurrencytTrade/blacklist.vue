<template>
  <div>
    <div class="headCon">
      <span class="goBack" @click="goBack"></span>
      <span>黑名单</span>
    </div>
    <div class="main" v-show="isData">
      <span class="blacklistIcon"></span>
      <p class="icon-t">暂无记录</p>
    </div>
    <div class="list">
      <ul>
        <li class="li-f">
          <span>用户名</span>
          <span>屏蔽时间</span>
          <span>操作</span>
        </li>
        <li v-for="(item, index) in list">
          <span>{{item.NickName}}</span>
          <span>{{item.ShieldTime}}</span>
          <span class="removeBtn" @click="removeBtn(item.Shielded)">移除</span>
        </li>
      </ul>

    </div>
  </div>
</template>
<script type="text/babel">
  import TheFooter from '@/components/footer'
  import {getBlackList, relaseMerchant} from "@/service/CurrencytTrade";
  import {createNamespacedHelpers} from "vuex";
  import Verification from "@/assets/js/Verification";
  const {mapState, mapMutations} = createNamespacedHelpers("pairs");
  import {Toast, InfiniteScroll} from 'mint-ui';
  export default {
    name: "blacklist",
    data(){
      return {
        msg: "blacklist",
        isData: false,
        list: []
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
      goBack(){   //返回按钮
        this.$router.push({path: '/accountFiat'});
      },
      getData() {   //获取黑名单数据
        let option = {
          pageIndex: 1,
        }; // 参数
        const res = getBlackList(option); // 调用请求传参
        res.then(data => {
          // 成功
          if (Verification.handleData(data)) {
            this.list = data.Data.DataList;
          }
        });
        res.catch(err => {
          // 失败
          console.log(err);
        });
      },
      removeBtn(id) {   //移除黑名单数据
        let option = {
          merchantId: id
        }; // 参数
        const res = relaseMerchant(option); // 调用请求传参
        res.then(data => {
          // 成功
          if (Verification.handleData(data)) {
            this.$toast({
              message: data.Data.Msg || "移除成功！",
              duration: 600,
              position: 'top'
            });
            this.getData();
          }
        });
        res.catch(err => {
          // 失败
          console.log(err);
        });
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
    }
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

  .main {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    .blacklistIcon {
      display: inline-block;
      width: 191px;
      height: 181px;
      @include bg-icon('blacklistIconPic.png', 181px, 191px);
    }
    .icon-t {
      margin-top: 58px;
      font-size: 30px;
      font-family: PingFang-SC-Medium;
      color: #80878E;
    }
  }

  .list {
    margin: 0 30px;
    ul {
      margin-top: 45px;
      li:first-child {
        font-size: 28px;
        font-family: PingFang-SC-Medium;
        color: #80878E;
      }
      li {
        display: flex;
        font-size: 30px;
        font-family: PingFang-SC-Medium;
        margin-bottom: 45px;
        color: #0D2B47;
        .removeBtn {
          color: #3291EB;
        }
        span:first-child {
          text-align: left;
          flex: 1;
        }
        span:nth-child(2) {
          flex: 2;
          text-align: center;
        }
        span:last-child {
          text-align: right;
          flex: 1;
        }
      }
    }

  }
</style>
