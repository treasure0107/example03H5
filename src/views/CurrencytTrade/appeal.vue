<template>
  <!--发起申诉-->
  <div>
    <div class="headCon">
      <span class="goBack" @click="goBack"></span>
      <span>上传凭证</span>
    </div>
    <section class="main">
      <div class="order-num">
        <span class="o-t">申诉订单号</span>
        <span class="num">{{OrderId}}</span>
      </div>
      <div class="icon-b"></div>
      <div class="order-type">
        <span class="o-t">问题类型</span>
        <div class="num">
          <a href="javascript:void(0);" class="icon-q" @click="popupVisible = true;">
            <span v-text="Iussuetype"></span>
            <span class="icon-q-a"></span>
          </a>
        </div>
      </div>
      <div class="icon-b"></div>
      <div class="dec">
        <div class="tit">问题描述*</div>
        <textarea class="dec-t" v-model="Remarke"></textarea>
      </div>
      <div class="icon-b"></div>
      <form class="file" enctype="multipart/form-data">
        <div class="dec upload-c">
          <div class="tit">上传凭证*</div>
          <div class="u-t-i">最多可传3张，支持JPG、PNG格式，文件小于2M</div>
          <div class="u-p">
            <div class="u-l-i">
              <a href="javascript:void (0);" class="u-camera"></a>
              <input type="file" class="uploadInput" ref="updataInput"
                     @change="onFileChange($event)">
            </div>
            <div class="u-l-p" v-for="(item, index) in iussueimg">
              <span class="delImg" @click="delImg(item,index)"></span>
              <img :src="imgBaseUrl+item" alt="">
            </div>
          </div>
          <mt-button :disabled="isDisabled" type="primary" size="large" class="btn" @click="appeal">立即申诉</mt-button>
        </div>
      </form>
    </section>
    <mt-popup
      v-model="popupVisible"
      position="bottom" class="popupVisiblePhoto">
      <div class="popup-item" @click="issueType('对方无应答')">对方无应答</div>
      <div class="popup-item" @click="issueType('对方有欺诈行为')">对方有欺诈行为</div>
      <div class="popup-item" @click="issueType('对方未放币')">对方未放币</div>
      <div class="popup-item" @click="issueType('对方未付款')">对方未付款</div>
      <div class="popup-item" @click="issueType('其他')">其他</div>
      <div class="line-popup"></div>
      <div class="popup-item" @click="popupVisible=false;">取消</div>
    </mt-popup>
  </div>
</template>
<script type="text/babel">
  import {AddIussueINfo, Upload} from "@/service/CurrencytTrade";
  import {createNamespacedHelpers} from "vuex";
  import Verification from "@/assets/js/Verification";
  const {mapState, mapMutations} = createNamespacedHelpers("pairs");
  import {Popup, Toast, Indicator} from 'mint-ui';
  import {imgBaseUrl} from '@/config/nev' // imgBaseUrl
  export default {
    data(){
      return {
        popupVisible: false,
        Iussuetype: "对方有欺诈行为",
        OrderId: '',   //申诉订单号
        Remarke: "",   //问题描述
        iussueimg: [],   //上传的图片路径数组
        form: {},
        imgBaseUrl: '',
        isDisabled: false,   //禁用状态
        OrderType: '',
        entrustId: ''
      }
    },

    mounted() {
      this.OrderId = this.$route.query.id;
      this.OrderType = this.$route.query.type;
      if (this.OrderType == 1) {
        this.entrustId = this.$route.query.entrustId;
      }
      this.imgBaseUrl = imgBaseUrl;
      this.OrderType = this.$route.query.type;
      /*this.setDefaultLanguage();*/
    },
    i18n: {
      messages: {
        "zh-CN": {
          lang: "中文",
          know: '知道了',
          sure: '确定',
          cancel: '取消',

        },
        "en-US": {
          lang: "English",
          know: 'know',
          sure: 'sure',
          cancel: 'cancel',
        }
      }
    },
    methods: {
      ...mapMutations([
        'setTheme'
      ]),
      onFileChange(e){   //上传图片方法
        var self = this;
        let fileObj = self.$refs.updataInput.files;
        var isUpdate = true;
        for (var i = 0; i < fileObj.length; i++) {
          //console.log(fileObj[i].type);
          if (fileObj[i].type != 'image/png' && fileObj[i].type != 'image/gif' && fileObj[i].type != 'image/jpeg') {
            isUpdate = false;
            break;
          }
        }
        if (isUpdate) {
          let form = new FormData();
          form.append('file', fileObj[0]);
          if (this.iussueimg.length > 2) {
            this.$toast({
              message: "最多可传上传3张图片！",
              duration: 2000
            });
            return false;
          }
          this.upLoad(form);
        } else {
          this.$toast({
            message: "只能上传图片！",
            duration: 3000
          });
        }

      },
      upLoad(form) {   //上传图片请求接口
        let option = form; // 参数
        const res = Upload(option); // 调用请求传参
        res.then(data => {
          // 成功
          if (Verification.handleData(data)) {
            //console.log(data.Data.FileUrl);
            this.iussueimg.push(data.Data.FileUrl);
          }
        });
        res.catch(err => {
          // 失败
          console.log(err);
        });
      },
      delImg(item, index){   //点击删除图片
        var self = this;
        for (var i = 0; i < self.iussueimg.length; i++) {
          if (i == index) {
            self.iussueimg.splice(index, 1);
          }
        }
      },
      issueType(issue){   //申诉理由选择
        this.Iussuetype = issue;
        this.popupVisible = false;
      },
      appeal(){   //立即申诉，提交信息，请求接口
        var _this = this;
        this.isDisabled = true;
        if (!this.Remarke) {
          this.isDisabled = false;
          this.$toast({
            message: "申诉问题描述不能为空！",
            duration: 1000,
            position: 'top'
          });
          return false;
        }
        if (this.iussueimg.length == 0) {
          this.isDisabled = false;
          this.$toast({
            message: "上传凭证图片不能为空！",
            duration: 1000,
            position: 'top'
          });
          return false;
        }
        let option = {
          OrderId: this.OrderId,
          Iussuetype: this.Iussuetype,
          Remarke: this.Remarke,
          iussueimg: this.iussueimg
        }; // 参数

        const res = AddIussueINfo(option); // 调用请求传参
        res.then(data => {   // 成功
          this.isDisabled = false;
//          if (Verification.handleData(data)) {
            if (this.OrderType == 1) {
              this.$router.push({
                path: '/orderRecordDetails',
                query: {id: this.OrderId, entrustId: this.entrustId, type: this.OrderType}
              });
            } else {
              this.$router.push({path: '/orderRecordDetails', query: {id: this.OrderId, type: this.OrderType}});
            }
//            this.$router.push({path: '/orderRecordDetails', query: {id: _this.OrderId, type: this.OrderType}});
//          }
        });
        res.catch(err => {
          this.isDisabled = false;

          // 失败
          console.log(err);
        });
      },
      goBack(){   //返回按钮
//        this.$router.go(-1);
        if (this.OrderType == 1) {
          this.$router.push({
            path: '/orderRecordDetails',
            query: {id: this.OrderId, entrustId: this.entrustId, type: this.OrderType}
          });
        } else {
          this.$router.push({path: '/orderRecordDetails', query: {id: this.OrderId, type: this.OrderType}});
        }
//        this.$router.push({path: '/orderRecordDetails', query: {id: this.OrderId}});
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
    .goBack {
      position: absolute;
      top: 28px;
      left: 30px;
      width: 30px;
      height: 30px;
      @include bg-icon('goBack.png', 30px);
    }
    .cancel {
      position: absolute;
      right: 30px;
      font-size: 26px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(80, 86, 92, 1);
    }
  }

  .popupVisiblePhoto {
    width: 100%;
    .popup-item {
      width: 100%;
      height: 90px;
      line-height: 90px;
      font-size: 28px;
      text-align: center;
      font-family: PingFang-SC-Bold;
      font-weight: 600;
      background-color: #fff;
      color: #4A647A;
      border-bottom: 2px solid #EEF2F5;
    }
    .line-popup {
      width: 100%;
      height: 10px;
      background-color: rgba(0, 0, 0, .5);
    }
  }

  .popup {
    width: 750px;
    height: 450px;
    background: rgba(255, 255, 255, 1);
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 40px 30px 27px 30px;
      border-bottom: 2px solid #cfd6db;
      .left {
        font-size: 32px;
        font-weight: 800;
        color: rgba(14, 48, 76, 1);
      }
      .right {
        font-size: 26px;
        font-weight: 500;
        color: rgba(173, 183, 193, 1);
      }
    }
    .center {
      margin: 72px 30px;
      padding: 8px 0;
      display: flex;
      justify-content: space-between;
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
        width: 120px;
        height: 60px;
      }
    }
    .submit {
      width: 690px;
      height: 80px;
      font-size: 34px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(50, 145, 235, 1);
      margin: 18px auto;
      background: $blue;
      border-radius: 4px;
      color: #fff;
      text-align: center;
      line-height: 80px;
    }
  }

  .main {
    .icon-b {
      width: 100%;
      height: 10px;
      background-color: #f7f9fc;
    }
    .order-num {
      font-size: 30px;
      font-family: PingFang-SC-Medium;
      color: #0E304C;
      height: 100px;
      line-height: 100px;
      margin-bottom: 10px;
      padding: 0 30px;
      display: flex;
      .o-t {
        flex: 1;
        text-align: left;
      }
      .num {
        flex: 2;
        text-align: right;
      }
    }
    .order-type {
      font-size: 30px;
      font-family: PingFang-SC-Medium;
      color: #0E304C;
      height: 100px;
      line-height: 100px;
      padding: 0 30px;
      display: flex;
      .o-t {
        flex: 1;
        text-align: left;
      }
      .num {
        flex: 1;
        text-align: right;
        .icon-q {
          display: inline-block;
          width: 294px;
          height: 70px;
          line-height: 70px;
          text-align: center;
          border: 2px solid rgba(238, 242, 245, 1);
        }
        .icon-q-a {
          display: inline-block;
          width: 20px;
          height: 11px;
          @include bg-icon('iconDownArrow.png', 20px, 11px);
        }
      }
    }
    .dec {
      padding: 30px 30px;
      .tit {
        font-size: 30px;
        margin-bottom: 30px;
        font-family: PingFang-SC-Medium;
        color: #0E304C;
      }
      .dec-t {
        width: 100%;
        min-height: 300px;
        font-size: 24px;
        font-family: PingFang-SC-Medium;
        font-weight: 500;
        color: rgba(14, 48, 76, 1);
        line-height: 36px;
        outline: none;
        border: 1px solid #EEF2F5;
        text-indent: 1em;
      }
    }
    .upload-c {
      .u-t-i {
        font-size: 24px;
        margin-top: 10px;
        margin-bottom: 40px;
        font-family: PingFang-SC-Medium;
        color: #ADB7C1;
      }
    }
    .u-p {
      margin-top: 31px;
      display: flex;
      .u-l-i {
        display: inline-block;
        width: 140px;
        height: 140px;
        background: #F7F9FC;
        margin-right: 10px;
        position: relative;
        .u-camera {
          position: absolute;
          top: 46px;
          left: 46px;
          width: 56px;
          height: 48px;
          @include bg-icon('iconCamera.png', 56px, 48px);
        }
        .uploadInput {
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
          opacity: 0;
          -ms-filter: 'alpha(opacity=0)';
        }
      }
      .u-l-p {
        display: inline-block;
        width: 140px;
        height: 140px;
        background-color: #fff;
        border: 1px dashed rgba(173, 183, 193, 1);
        margin-left: 19px;
        position: relative;
        img {
          width: 100%;
          height: 100%;
        }
        .delImg {
          width: 40px;
          height: 40px;
          position: absolute;
          right: -10px;
          top: -10px;
          @include bg-icon('iconDelImg.png', 40px);
        }
      }
    }
    .btn {
      margin-top: 60px;
      height: 80px;
      font-size: 30px;
      font-family: PingFang-SC-Bold;
      letter-spacing: 10px;
      background-color: #3291EB;
    }
  }

</style>
