<template>
  <div>
    <div class="headCon">
      <span class="goBack" @click="$router.push('/')"></span>
      <span>币币账户</span>
    </div>
    <div class="m-o-s">
      <ul class="clearFl">
        <li>
          <div @click="cho()">
            <router-link to="/" >
              <div>
                <span class="receivingSet icon-pic"></span>
              </div>
              <div>充币</div>
            </router-link>
          </div>
        </li>
        <li>
          <div @click="cho(1)">
            <router-link to="/">
              <div>
                <span class="fundsTransfer icon-pic"></span>
              </div>
              <div>提币</div>
            </router-link>
          </div>
        </li>
        <li>
          <router-link to="/serCoin?type=3">
            <div>
              <span class="assetDetails icon-pic"></span>
            </div>
            <div>钱包地址</div>
          </router-link>
        </li>
        <li>
          <router-link to="/dealerList">
            <div>
              <span class="blacklist icon-pic"></span>
            </div>
            <div>交易记录</div>
          </router-link>
        </li>

      </ul>
    </div>
    <div style="width: 100%;height: 20px;background-color: #F7F9FC;"></div>
    <div class="list">
      <div class="asset-tit">
        <span>资产明细</span>
        <span class="asset-tit-b">
          <span class="checked-con" :class="{checkedActive:isCheckedActive}" @click="checkedBtn"></span>
          隐藏0余额
        </span>
      </div>
      <table >
        <tr class="tr-f">
          <td>币种</td>
          <td>可用</td>
          <td>冻结</td>
        </tr>
        <tr class="tr-a" v-for="(item, index) in dataList" :key="index">
          <td v-text="item.Unit">BTC</td>
          <td v-text="item.Available">32349.9772</td>
          <td v-text="item.Frozen">4249.52313</td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
import TheFooter from '@/components/footer'
import { GetUserAssetList } from '@/service/coinTrade';
import { getUserMsg } from "@/service/account";
import Bus from "@/assets/js/bus";
import Verification from "@/assets/js/Verification";
import {createNamespacedHelpers} from "vuex";
const {mapState, mapMutations} = createNamespacedHelpers("pairs");
import {InfiniteScroll, Popup, MessageBox} from 'mint-ui';
export default {
  name: "currencytTrade",
  data() {
    return {
      dataList: [],
      isCheckedActive: false,
    };
  },
  mounted() {
    this.getData();
    this.setUserInfo();
  },
  methods: {
    ...mapMutations([
      'setTheme'
    ]),
    setUserInfo() {
      Bus.$on("setUserInfo", () => {
        const res = getUserMsg();
        res.then(data => {
          if (Verification.handleData(data)) {
            localStorage.setItem("UserInfo", JSON.stringify(data.Data));
          }
        });
        res.catch(error => {});
      });
    },
    cho(is){
      var obj = JSON.parse(window.localStorage.getItem('UserInfo'))
      if (!obj.IsSafePwd) {
        this.$toast({
          message: "请先去设置资金密码",
          position: 'top',
          duration: 2000
        });
        return
      } else {
        if (is) {
          this.$router.push('/outCoin');
        } else {
          this.$router.push('/serCoin');
        }
      }
    },
    mask(){

    },
    getData() {
      let self = this;
      let option = {}; // 参数
      const res = GetUserAssetList(option); // 调用请求传参
      res.then(data => {
        if (Verification.handleData(data)) {
          self.dataList = data.Data;
        }
      });
      res.catch(err => {
        // 失败
        console.log(err);
      });
    },
    checkedBtn(){
      if (!this.isCheckedActive) {
        this.isCheckedActive = true;
        let arr = [];
        this.dataList.map((item) => {
          if (item.Available > 0) {
            arr.push(item)
          }
          return arr
        });
        this.dataList = arr;
      } else {
        this.isCheckedActive = false;
        this.getData();
      }
    },
  },
  computed: {
    ...mapState([
      'theme',
    ])
  },
};
</script>

<style lang="scss" scoped>
  @import '~@/design/scoped';

  a:hover, a:visited, a:link, a:active {
    text-decoration: none;
    color: inherit;
  }

  .clearFl:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0
  }

  .clearFl {
    zoom: 1
  }

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

  .m-o-s {
    background-color: #fff;
    ul {
      padding: 30px;
      li {
        float: left;
        margin-top: 29px;
        width: 25%;
        div {
          text-align: center;
        }

        div:last-child {
          font-size: 28px;
          font-family: PingFang-SC-Medium;
          font-weight: 500;
          color: rgba(74, 100, 122, 1);
        }
        .icon-pic {
          display: inline-block;
          width: 44px;
          height: 47px;
          margin-bottom: 10px;
        }
        .receivingSet {
          @include bg-icon('inCoin.png', 47px, 44px);
        }
        .fundsTransfer {
          @include bg-icon('outbi.png', 47px, 44px);
        }
        .assetDetails {
          @include bg-icon('qb.png', 47px, 44px);
        }
        .blacklist {
          @include bg-icon('jyjl.png', 47px, 44px);
        }
      }
    }
  }

  .list {
    width: 100%;
    .asset-tit {
      padding: 0 30px;
      height: 88px;
      line-height: 88px;
      font-size: 32px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(74, 100, 122, 1);
      .asset-tit-b {
        float: right;
        font-size: 26px;
        font-family: PingFang-SC-Medium;
        color: rgba(119, 138, 158, 1);
        .checked-con {
          display: inline-block;
          width: 24px;
          height: 24px;
          border: 2px solid #778A9E;
          margin-right: 16px;
          position: relative;
          top: 3px;
        }
        .checkedActive {
          @include bg-icon('checkedPic.png', 24px);
        }
      }
    }
    table {
      width: 100%;
      tr {
        td {
          text-align: center;
        }
        td:first-child {
          text-align: left;
          padding-left: 30px;
        }
        td:last-child {
          text-align: right;
          padding-right: 30px;
        }
      }
      .tr-f {
        height: 70px;
        line-height: 70px;
        background: #F7FBFC;
        td {
          font-size: 26px;
          font-family: PingFang-SC-Medium;
          font-weight: 500;
          color: rgba(181, 192, 203, 1);
        }
      }
      .tr-a {
        height: 106px;
        line-height: 106px;
        border-bottom: 1px solid #EEF2F5;
        td {
          font-size: 32px;
          font-family: PingFang-SC-Bold;
          color: rgba(14, 48, 76, 1);
        }
      }

    }
  }

</style>
