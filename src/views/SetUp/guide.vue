<template>
    <div class="container">
        <header-back>{{$t('header')}}</header-back>
        <section>
            <router-link :to="'/GuideDetail?id='+item.id+'&name='+item.text" class="list" v-for="(item,index) in tableList" :key="index">
                <p>{{item.text}}</p>
                <span></span>
              </router-link>
        </section>
    </div>
</template>
<script>
import headerBack from "@/components/headerBack";
export default {
  data() {
    return {
      tableList: [
        {
          text: "绑定手机",
          id: 1
        },
        {
          text: "绑定邮箱",
          id: 2
        },
        {
          text: "币币充币",
          id: 3
        },
        {
          text: "登录",
          id: 4
        },
        {
          text: "币币划转",
          id: 5
        },
        {
          text: "币币买入",
          id: 6
        },
        {
          text: "币币卖出",
          id: 7
        },
        {
          text: "修改登录密码",
          id: 8
        },
        {
          text: "修改资金密码",
          id: 9
        },
        {
          text: "币币站内互转",
          id: 10
        },
        {
          text: "找回登录密码",
          id: 11
        },
        {
          text: "注册",
          id: 12
        },
        {
          text: "法币收款设置",
          id: 13
        },
        {
          text: "法币资金划转",
          id: 14
        },
        {
          text: "币币钱包管理",
          id: 15
        },
        {
          text: "币币提币",
          id: 16
        },
        {
          text: "法币买方申诉",
          id: 17
        },
        {
          text: "法币买入",
          id: 18
        },
        {
          text: "法币卖出",
          id: 19
        },
        {
          text: "法币卖方申诉",
          id: 20
        }
      ]
    };
  },
  i18n: {
    messages: {
      "zh-CN": {
        header: "新手指导"
      },
      "en-US": {
        header: ""
      }
    }
  },
  components: { headerBack },
  mounted() {},
  methods: {}
};
</script>
<style lang="scss" scoped>
@import "~@/design/scoped";
.container {
  section {
    margin-top: 100px;
    padding: 0 30px;
    a {
      height: 80;
      border-bottom: 1px solid #efefef;
      display: flex;
      justify-content: space-between;
      align-items: center;
      p {
        font-size: 30px;
        font-family: PingFang-SC-Bold;
        font-weight: 500;
        line-height: 80px;
        color: rgba(14, 48, 76, 1);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      span {
          display: block;
          @include bg-icon("Forward.png", 17px, 29px);
        }
    }
  }
}
</style>
