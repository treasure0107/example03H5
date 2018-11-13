<template>
  <div>
    <div class="headCon">
      <span class="goBack" @click="goBack"></span>
      <span>收款设置</span>
    </div>
    <section>
      <div class="main">
        <div class="m-tit">收款方式</div>
        <a href="javascript:void (0);" class="btn" v-show="isShow" @click="addBank">添加银行卡</a>
        <div class="list" v-if="!isShow">
          <div class="tit">
            <span>银行卡</span>
            <a href="javascript:void (0);" @click="addBank" class="t-r-a">添加</a>
          </div>
          <ul class="bank-list">
            <li v-for="(item, index) in BankList">
              <leftSlider :index="1" @deleteItem="deleteItem(item.Id)">
                <div class="bank-item" :class="{'item-del':isDeleting}">
                  <div class="radio-item">
                    <span class="r-i-l">{{item.BankName }}</span>
                    <span class="r-i-r">
                  </span>
                  </div>
                  <p class="b-s">{{item.Remark}}</p>
                  <p class="b-n">{{item.BankCard}}</p>
                  <!--<a href="javascript:void(0)" class="deletePic" @click="deletePic"></a>-->
                </div>
              </leftSlider>
            </li>
          </ul>
        </div>
        <div class="list" v-if="BankList">
          <div class="tit">
            <span>支付宝</span>
            <a href="javascript:void (0);" class="t-r-a" v-if="!AlipayList" @click="addAlipay">添加</a>
          </div>
          <ul class="bank-list">
            <li v-for="(item, index) in AlipayList">
              <div class="bank-item">
                <div class="radio-item">
                  <span class="r-i-l">姓名</span>
                  <span v-if="item.AlipayStatus==-1" style="margin-right: 30px;color: #3291EB;"
                        @click="addAlipay">重新添加</span>
                  <span class="r-i-c" v-if="item.AlipayStatus==1">审核通过</span>
                  <span class="r-i-c" v-if="item.AlipayStatus==0">审核中</span>
                  <span class="r-i-c" v-if="item.AlipayStatus==-1">审核失败</span>
                </div>
                <p class="b-s">{{item.Remark}}</p>
                <p class="b-n">{{item.AlipayAccount }}</p>
              </div>
            </li>
          </ul>
          <div class="contact-del" v-if="AlipayList">
            <span>删除支付宝请前往PC端联系客服</span>
          </div>
        </div>
      </div>
    </section>
    <!--弹窗-->
    <mt-popup
      v-model="popupVisible"
      class="popupVisibleDel">
      <div class="popup-tit">提示</div>
      <div class="popup-con">您还没有设置资金密码</div>
      <div class="popBtn">
        <div @click="popupVisible = false;">取消</div>
        <div @click="goSet">去设置</div>
      </div>
    </mt-popup>
    <mt-popup
      v-model="popupVisibleIcon"
      class="popupVisibleQuery">
      <div class="popup-tit">提示</div>
      <div class="popup-con">请您先在PC端进行实名认证才能添加银行卡</div>
      <div class="popBtn" @click="popupVisibleIcon=false;">知道了</div>
    </mt-popup>
    <mt-popup
      v-model="popupVisibleDel"
      class="popupVisibleDel">
      <div>
        <div class="popup-tit">提示</div>
        <div class="popup-con">确定删除该银行卡吗？</div>
        <div class="popBtn">
          <div @click="popupVisibleDel = false;">取消</div>
          <div @click="sureDel">确定</div>
        </div>
      </div>
    </mt-popup>
  </div>
</template>
<script type="text/babel">
  import {GetPayment, RemovePayment, GetUserInfo} from "@/service/CurrencytTrade";
  import countDown from '@/components/countDown';
  import {createNamespacedHelpers} from "vuex";
  import Verification from "@/assets/js/Verification";
  const {mapState, mapMutations} = createNamespacedHelpers("pairs");
  import LeftSlider from '@/components/leftSlider';
  import {InfiniteScroll, Popup, Toast, CellSwipe} from 'mint-ui';
  export default {
    data(){
      return {
        isShow: false,
        isDeleting: false,
        popupVisible: false,
        popupVisibleIcon: false,
        popupVisibleDel: false,
        BankList: '',
        AlipayList: '',
        UserInfo: {},
        IdentifyStatus: 0,
        BankcardId: '',
        IsSafePwd: true
      }
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
    mounted(){
      this.getData();
      this.getUserInfo();
    },
    methods: {
      ...mapMutations([
        'setTheme'
      ]),
      goSet(){   //跳转到设置资金密码
        this.$router.push({path: '/ModifySafe', query: {type: 'set'}});
      },
      addBank(){   //添加银行卡
        if (this.IdentifyStatus != 0) {   //有没有实名认证
          if (this.IsSafePwd) {   //有没有设置资金密码
            this.$router.push({path: '/addBankCard'});
          } else {
            this.popupVisible = true;
          }
        } else {
          this.popupVisibleIcon = true;
        }
      },
      addAlipay(){   //添加支付宝
        if (this.IdentifyStatus != 0) {
          this.$router.push({path: '/addAlipay'});
        } else {
          this.popupVisibleIcon = true;
        }

      },
      deleteItem(id) {   //侧滑点击删除显示弹窗
        this.popupVisibleDel = true;
        this.BankcardId = id;
      },
      sureDel(){   //删除银行卡
        this.popupVisibleDel = false;
        let option = {
          BankcardId: this.BankcardId
        }; // 参数
        const res = RemovePayment(option); // 调用请求传参
        res.then(data => {
          // 成功
          if (Verification.handleData(data)) {
            this.getData();
          }
        });
        res.catch(err => {
          // 失败
          console.log(err);
        });
      },
      getUserInfo() {   //获取用户详情
        let option = {}; // 参数
        const res = GetUserInfo(option); // 调用请求传参
        res.then(data => {   // 成功
          if (Verification.handleData(data)) {
            this.UserInfo = data.Data;
//            console.log(this.UserInfo);
            this.IdentifyStatus = this.UserInfo.IdentifyStatus;
            if (this.UserInfo.IdentifyStatus == 0) {   //有没有实名认证
              this.popupVisibleIcon = true;
            }
            if (this.UserInfo.IsSafePwd) {   //有没有设置资金密码
              this.IsSafePwd = true;
            } else {
              this.IsSafePwd = false;
            }
          }

        });
        res.catch(err => {  // 失败
          console.log(err);
        });
      },
      getData() {   //获取收款方式
        let option = {}; // 参数
        const res = GetPayment(option); // 调用请求传参
        res.then(data => {
          // 成功
          if (Verification.handleData(data)) {
//            console.log(data.Data);
            this.BankList = data.Data.Bank;
            this.AlipayList = data.Data.Alipay;
          }
        });
        res.catch(err => {
          // 失败
          console.log(err);
        });
      },
      goBack(){   //返回按钮
        this.$router.push({path: '/accountFiat'});
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
      }
    },
    components: {
      LeftSlider
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

  .popupVisibleQuery {
    width: 560px;
    .popup-tit {
      font-size: 34px;
      font-family: PingFang-SC-Heavy;
      font-weight: 600;
      color: rgba(14, 48, 76, 1);
      text-align: center;
      padding: 43px 0;
    }
    .popup-con {
      font-size: 28px;
      font-family: PingFang-SC-Medium;
      color: rgba(14, 48, 76, 1);
      text-align: center;
      padding-bottom: 43px;
      border-bottom: 1px solid #CFD6DB;
    }
    .popBtn {
      height: 100px;
      line-height: 100px;
      text-align: center;
      font-size: 34px;
      font-family: PingFang-SC-Medium;
      color: #3291EB;
    }
  }

  .popupVisibleDel {
    width: 560px;
    .popup-tit {
      font-size: 34px;
      font-family: PingFang-SC-Heavy;
      font-weight: 600;
      color: rgba(14, 48, 76, 1);
      text-align: center;
      padding: 43px 0;
    }
    .popup-con {
      font-size: 28px;
      font-family: PingFang-SC-Medium;
      color: rgba(14, 48, 76, 1);
      text-align: center;
      padding-bottom: 43px;
      border-bottom: 1px solid #CFD6DB;
    }
    .popBtn {
      height: 100px;
      line-height: 100px;
      display: flex;
      div {
        flex: 1;
        font-size: 34px;
        font-family: PingFang-SC-Medium;
        font-weight: 500;
        color: #3291EB;
        text-align: center;
      }
      div:first-child {
        border-right: 1px solid #CFD6DB;
      }
    }
  }

  .main {
    padding: 30px;
    .m-tit {
      font-size: 50px;
      font-family: PingFang-SC-Bold;
      font-weight: 500;
      color: rgba(14, 48, 76, 1);
    }
    .btn {
      display: block;
      width: 100%;
      height: 92px;
      line-height: 92px;
      text-align: center;
      font-size: 30px;
      margin-top: 150px;
      font-family: PingFang-SC-Medium;
      color: #3291EB;
      background-color: #fff;
      border: 2px solid #3291EB;
      border-radius: 4px;
    }
    .list {
      font-family: PingFang-SC-Medium;
      .tit {
        display: flex;
        margin-top: 64px;
        margin-bottom: 32px;
        span {
          flex: 1;
          text-align: left;
          font-size: 32px;
          font-family: PingFang-SC-Medium;
          color: rgba(74, 100, 122, 1);
        }
        .t-r-a {
          flex: 1;
          text-align: right;
          font-size: 28px;
          font-family: PingFang-SC-Medium;
          color: #3291EB;
        }
      }
      .bank-list {
        li {
          width: 100%;
          margin-top: 40px;
          box-shadow: 0 0 24px 0 rgba(13, 76, 135, 0.3);
          .bank-item {
            padding: 32px 30px 38px 33px;
            background-color: #fff;
            .radio-item {
              display: flex;
              .r-i-l {
                flex: 1;
                font-size: 32px;
                font-family: PingFang-SC-Bold;
                font-weight: 600;
                color: #0E304C;
                text-align: left;
              }
              .r-i-c {
                font-size: 22px;
                font-family: PingFang-SC-Medium;
                font-weight: 500;
                color: #F5174D;
              }
              .r-i-r {
                flex: 1;
                text-align: right;
                .radio-circle {
                  display: inline-block;
                  width: 26px;
                  height: 26px;
                  border: 1px solid rgba(74, 100, 122, 1);
                  border-radius: 50%;
                  vertical-align: middle;
                  margin-right: 10px;
                }
                .radio-circle:active {
                  background-color: #3291EB;
                  border: none;
                }
                .radio-default {
                  display: inline-block;
                  width: 97px;
                  height: 36px;
                  line-height: 36px;
                  text-align: center;
                  background: rgba(235, 245, 255, 1);
                  border-radius: 4px;
                  font-size: 20px;
                  font-family: PingFang-SC-Medium;
                  font-weight: 500;
                  color: rgba(50, 145, 235, 1);
                }
                .m-icon {
                  font-size: 22px;
                  color: #4A647A;
                  vertical-align: middle;
                }
              }

            }

            .b-s {
              font-size: 22px;
              margin-top: 15px;
              color: #4A647A;
            }
            .b-n {
              font-size: 36px;
              margin-top: 35px;
              color: #0E304C;
            }
          }
          .item-del {
            background: rgba(249, 74, 117, .8);
            border-radius: 4px;
            position: relative;
            .deletePic {
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              width: 94px;
              height: 100px;
              @include bg-icon('deletePic.png', 94px, 100px);
            }
          }
        }
      }
      .contact-del {
        font-size: 24px;
        color: #ADB7C1;
        text-align: center;
        padding: 37px 0 64px;

      }
    }
  }

</style>
