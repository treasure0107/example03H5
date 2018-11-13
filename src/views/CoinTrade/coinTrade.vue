<!-- 首页 -->
<template>
  <div>
    <div class="content">
      <header>
        <span class="test" @click="$router.push('/MarketList?type=bb')">{{targetCoin2+'/'+baseCoin2}}</span>
        <span class="select" @click="$router.push('/MarketList?type=bb')"></span>
        <span class="market" @click="$router.push('/QuotationServer')"></span>
      </header>
      <div class="tab">
        <a href="javascript:void (0)" :class="{col:a}" @click="chan(1)">
          {{$t('mairu')}}
          <div :class="{d1:a}"></div>
        </a>
        <a href="javascript:void (0)" :class="{col2:b}" @click="chan(2)">
          {{$t('maichu')}}
          <div :class="{d2:b}"></div>
        </a>
        <a v-if="loginStaus" href="javascript:void (0)" @click="$router.push('/entrust')">
          {{$t('weituo')}}
          <div></div>
        </a>
        <a v-if="!loginStaus" href="javascript:void (0)">
          {{$t('weituo')}}
          <div></div>
        </a>
      </div>
      <div class="warp">
        <div v-if="isbuy">
          <div class="ipt">
            <input type="number" id="inp" placeholder="单价" v-model="buyPrice" @keyup="keyFn(a)"  @change="cge()"><span>{{baseCoin2}}</span>
          </div>
          <div class="ipt">
            <input id="inpp" type="number" placeholder="数量" maxlength="11" v-model="buyVolume" @keyup="keFn(a)" @change="cge()"><span>{{targetCoin2}}</span>
          </div>
          <div class="cles">
            <span v-for="(item, index) in tabsName" :key="index" @click="chanRa(index,a)" v-bind:class="{acactive:item.isclick}">{{item.name}}</span>
          </div>
          <div class="ipt">
            <input type="number" placeholder="交易额" disabled v-model="allbuy"><span>{{baseCoin2}}</span>
          </div>
          <div class="tex">
            <span style="float: left;">可用</span>
            <span style="float: right;" v-text="Avail">----</span>
          </div>
          <div v-if="loginStaus" class="btn" @click="buyFn(1)">买 入</div>
          <div v-if="!loginStaus" class="btn" @click="$router.push('/login')">登录</div>
        </div>
        <div v-if="!isbuy">
          <div class="ipt">
            <input id="in" type="number" placeholder="单价" v-model="price" @keyup="keyFn()" @change="cge()"><span>{{baseCoin2}}</span>
          </div>
          <div class="ipt">
            <input id="ip" type="number" placeholder="数量" v-model="volume" @keyup="keFn()" @change="cge()"><span>{{targetCoin2}}</span>
          </div>
          <div class="cles">
            <span v-for="(item, index) in tabsName" :key="index" @click="chanRa(index)" v-bind:class="{active:item.isclick}">{{item.name}}</span>
          </div>
          <div class="ipt">
            <input type="number" placeholder="交易额" disabled v-model="all"><span>APPLE</span>
          </div>
          <div class="tex">
            <span style="float: left;">可用</span>
            <span style="float: right;" v-text="Available">----</span>
          </div>
          <div v-if="loginStaus" class="btn" style="background: #F5174D; color: #fff" @click="buyFn()">卖 出</div>
          <div v-if="!loginStaus" class="btn" style="background: #F5174D; color: #fff" @click="$router.push('/login')">登 录</div>
        </div>
        <div class="tabl">
          <ul>
            <li>
              <span style="color:#80878E">价格({{baseCoin2}})</span>
              <span style="color:#80878E;top:0;right: 0;position: absolute">数量({{targetCoin2}})</span>
            </li>
            <li @click="isbuy?buyPrice = priArr[2]:price = priArr[2]">
              <span class="sply1" v-text="allArr[2].price==0?'--':allArr[2].price"></span>
              <span class="sply2" v-text="fixFn(allArr[2].NoComplete)==0?'--':fixFn(allArr[2].NoComplete)"></span>
              <div class="plir" :style="{width:wd2, background:bg1}"></div>
            </li>
            <li @click="isbuy?buyPrice = priArr[3]:price = priArr[3]">
              <span class="sply1" v-text="allArr[3].price==0?'--':allArr[3].price" ></span>
              <span class="sply2" v-text="fixFn(allArr[3].NoComplete)==0?'--':fixFn(allArr[3].NoComplete)"></span>
              <div class="plir" :style="{width:wd3, background:bg1}"></div>
            </li>
            <li @click="isbuy?buyPrice = priArr[4]:price = priArr[4]">
              <span class="sply1" v-text="allArr[4].price==0?'--':allArr[4].price"></span>
              <span class="sply2" v-text="fixFn(allArr[4].NoComplete)==0?'--':fixFn(allArr[4].NoComplete)"></span>
              <div class="plir" :style="{width:wd4, background:bg1}"></div>
            </li>
            <li @click="isbuy?buyPrice = priArr[5]:price = priArr[5]">
              <span class="sply1" v-text="allArr[5].price==0?'--':allArr[5].price"></span>
              <span class="sply2" v-text="fixFn(allArr[5].NoComplete)==0?'--':fixFn(allArr[5].NoComplete)"></span>
              <div class="plir" :style="{width:wd5, background:bg1}"></div>
            </li>
            <li @click="isbuy?buyPrice = priArr[6]:price = priArr[6]">
              <span class="sply1" v-text="allArr[6].price==0?'--':allArr[6].price"></span>
              <span class="sply2" v-text="fixFn(allArr[6].NoComplete)==0?'--':fixFn(allArr[6].NoComplete)"></span>
              <div class="plir" :style="{width:wd6, background:bg1}"></div>
            </li>
          </ul>
          <ul class="ul" >
            <li @click="isbuy?buyPrice = ask[0].price:price = ask[0].price">
              <span v-text="ask[0].price==0?'--':ask[0].price"></span>
              <span class="sply2" v-text="fixFn(ask[0].NoComplete)==0?'--':fixFn(ask[0].NoComplete)"></span>
              <div class="plir" :style="{width:ws0, background:bg2}"></div>
            </li>
            <li @click="isbuy?buyPrice = ask[1].price:price = ask[1].price">
              <span v-text="ask[1].price==0?'--':ask[1].price"></span>
              <span class="sply2" v-text="fixFn(ask[1].NoComplete)==0?'--':fixFn(ask[1].NoComplete)"></span>
              <div class="plir" :style="{width:ws1, background:bg2}"></div>
            </li>
            <li @click="isbuy?buyPrice = ask[2].price:price = ask[2].price">
              <span v-text="ask[2].price==0?'--':ask[2].price"></span>
              <span class="sply2" v-text="fixFn(ask[2].NoComplete)==0?'--':fixFn(ask[2].NoComplete)"></span>
              <div class="plir" :style="{width:ws2, background:bg2}"></div>
            </li>
            <li @click="isbuy?buyPrice = ask[3].price:price = ask[3].price">
              <span v-text="ask[3].price==0?'--':ask[3].price"></span>
              <span class="sply2" v-text="fixFn(ask[3].NoComplete)==0?'--':fixFn(ask[3].NoComplete)"></span>
              <div class="plir" :style="{width:ws3, background:bg2}"></div>
            </li>
            <li @click="isbuy?buyPrice = ask[4].price:price = ask[4].price">
              <span v-text="ask[4].price==0?'--':ask[4].price"></span>
              <span class="sply2" v-text="fixFn(ask[4].NoComplete)==0?'--':fixFn(ask[4].NoComplete)"></span>
              <div class="plir" :style="{width:ws4, background:bg2}"></div>
            </li>
          </ul>
        </div>
      </div>
      <div class="entrust">
        <h3>当前委托</h3>
        <ul v-if="loginStaus">
          <li v-for="(item, index) in CurrentEntrustList" @click="goD(item)" :key="index">
            <div class="fir">
              <div><span v-text="item.IsBuy==1?'买入':'卖出'"></span> <span v-text="item.Unit+'/'+item.ExchangeUnit"></span></div>
              <div><span v-text="item.EntrustStatusName"></span> <span>></span></div>
            </div>
            <div class="sed">
              <span style="text-align: left" v-text="'委托价('+ item.ExchangeUnit + ')'"></span>
              <span style="text-align: center" v-text="'委托量('+ item.Unit + ')'"></span>
              <span style="text-align: right">时间</span>
            </div>
            <div class="sed trr">
              <span style="text-align: left" v-text="item.EntrustPrice">2342354234</span>
              <span style="text-align: center" v-text="item.EntrustVolume" >234234</span>
              <span style="text-align: right" v-text="item.CreateTime ">08/16 17:30</span>
            </div>
          </li>
        </ul>
        <div class="den" v-if="!loginStaus">
          <span @click="$router.push('/login')">登录查看</span>
        </div>
      </div>
      <mt-popup
        v-model="popupVisible"
        position="bottom" style="z-index: 9999999">
        <div class="popup" >
          <div class="title">
            <p class="left">请输入资金密码</p>
            <p class="right" @click="popupVisible = false">取消</p>
          </div>
          <div class="center">
            <input type="password" v-model="SafePwd" placeholder="资金密码">
            <!--<img src="https://api.appleusdt.com/VerifyImgs/c28de67684624a398b193746ed49ad60.jpg" alt="">-->
          </div>
          <div v-if="isbuy" class="submit" @click="clck(a)">确定</div>
          <div v-if="!isbuy" class="submit" @click="clck()">确定</div>
        </div>
      </mt-popup>
    </div>
    <the-footer></the-footer>
  </div>
</template>

<script>
import TheFooter from "@/components/footer";
import Verification from "@/assets/js/Verification";
import "signalr";
import "@/assets/js/hubs";
import { getCoinTradeData, GetTradeStrategy, DoEntrust, GetEntrustRecentList } from '@/service/coinTrade';
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("pairs");
export default {
  name: "index",
  data() {
    return {
      a: true,
      b: false,
      ask: [{
        price: '',
        NoComplete: ''
      },{
        price: '',
        NoComplete: ''
      },{
        price: '',
        NoComplete: ''
      },{
        price: '',
        NoComplete: ''
      },{
        price: '',
        NoComplete: ''
      },],
      bid: [{
        price: '',
        NoComplete: ''
      },{
        price: '',
        NoComplete: ''
      },{
        price: '',
        NoComplete: ''
      },{
        price: '',
        NoComplete: ''
      },{
        price: '',
        NoComplete: ''
      }],
      isbuy: true,
      tabsName: [
        {
          name: "25%",
          isclick: false
        },
        {
          name: "50%",
          isclick: false
        },
        {
          name: '75%',
          isclick: false
        },
        {
          name: "100%",
          isclick: false
        }
      ],
      buyPrice: '',
      buyVolume: '',
      price: '',
      volume: '',
      allbuy: '',
      all: '',
      Available: '',
      Avail: '',
      popupVisible: false,
      strategy: '',
      SafePwd: '',
      CurrentEntrustList: [],
      bg1: 'rgba(245, 23, 77, 0.2)',
      bg2: 'rgba(29, 210, 93, 0.2)',
      wd1: '',
      wd2: '',
      wd0: '',
      wd3: '',
      wd4: '',
      wd5: '',
      wd6: '',
      ws0: '',
      ws1: '',
      ws2: '',
      ws3: '',
      ws4: '',
      compArr: [],
      priArr: [],
      loginStaus: '',
      isck: true,
      baseCoin2 : 'APPLE',
      targetCoin2: 'BTC',
      CeId: '',
      allArr: [{
        price: '',
        NoComplete: ''
      },{
        price: '',
        NoComplete: ''
      },{
        price: '',
        NoComplete: ''
      },{
        price: '',
        NoComplete: ''
      },{
        price: '',
        NoComplete: ''
      },{
        price: '',
        NoComplete: ''
      },{
        price: '',
        NoComplete: ''
      }]
    };
  },
  i18n: {
    messages: {
      "zh-CN": {
        mairu: "买入",
        maichu: "卖出",
        weituo: "委托历史"
      },
      "en-US": {}
    }
  },
  computed: {
    ...mapState(["baseCoin", "targetCoin"])
  },
  components: {
    TheFooter
  },
  mounted () {
    this.setSocket();
    this.updateMarket();
    let CurrencyPair = JSON.parse(window.localStorage.getItem('CurrencyPair'))
    if (CurrencyPair) {
      window.localStorage.getItem('CurrencyPair')
      this.baseCoin2 = CurrencyPair.baseCoin;
      this.targetCoin2 = CurrencyPair.targetCoin;
      this.CeId = window.localStorage.getItem('CeId');
    } else {
      this.baseCoin2 = 'APPLE';
      this.targetCoin2 = 'BTC';
      this.CeId = 54
    }
    if(window.localStorage.getItem('token')){
      this.loginStaus = true
    } else {
      this.loginStaus = false
    }
    if (this.loginStaus) {
      this.getData();
      this.GetEntrustRecentListFn()
      let tradeType = this.$route.query.tradeType;
      if (tradeType=='buy') {
        this.chan(1)
      } else if (tradeType=='sell') {
        this.chan(2)
      } else {
        this.chan(1)
      }
    }
  },
  methods: {
    setSocket() {
      let storage = JSON.parse(localStorage.getItem("CurrencyPair"));
      let klineSymbol;
      let to = new Date() * 1;
      let from = to - 7948800000;
      if (storage) {
        klineSymbol = storage.targetCoin + "_" + storage.baseCoin;
      } else {
        klineSymbol = "BTC_APPLE";
      }
      $.connection.hub.start().done(function() {
        $.connection.exchangeHub.server.init(klineSymbol, "MIN15", from, to);
      });
    },
    goD(item, index) {
      window.localStorage.setItem("bbbDetail", JSON.stringify(item))
      this.$router.push('/entrustDetail')
    },
    cge() {
      if (this.buyPrice > 11111111111) {
        this.buyPrice = ''
        this.$toast({
          message: "输入的价格太大",
          position: 'top',
          duration: 2000
        });
        return
      } else if (this.buyVolume > 11111111111){
        this.buyVolume = ''
        this.$toast({
          message: "输入的数量太大",
          position: 'top',
          duration: 2000
        });
        return
      } else if (this.price > 11111111111){
        this.price = ''
        this.$toast({
          message: "输入的价格太大",
          position: 'top',
          duration: 2000
        });
        return
      } else if (this.volume > 11111111111){
        this.volume = ''
        this.$toast({
          message: "输入的数量太大",
          position: 'top',
          duration: 2000
        });
        return
      }
      this.buyPrice = (parseFloat(this.buyPrice)).toFixed(7);
      this.buyPrice = this.buyPrice.substr(0, this.buyPrice.length - 1)
      this.buyVolume = (parseFloat(this.buyVolume)).toFixed(7);
      this.buyVolume = this.buyVolume.substr(0, this.buyVolume.length - 1)
      this.price = (parseFloat(this.price)).toFixed(7);
      this.price = this.price.substr(0, this.price.length - 1)
      this.volume = (parseFloat(this.volume)).toFixed(7);
      this.volume = this.volume.substr(0, this.volume.length - 1)
    },
    getData () {
      let option = {
        CeId: this.CeId
      }; // 参数
      const res = getCoinTradeData(option); // 调用请求传参
      res.then(data => {
        if (Verification.handleData(data)) {
          this.Avail = data.Data.ExchangeCurrencyAsset.Available;
          this.Available = data.Data.CurrencyAsset.Available;
        }
        // 成功
        // console.log(data);
      });
      res.catch(err => {
        // 失败
        console.log(err);
      });
    },
    GetEntrustRecentListFn () {
      let option = {
        CeId: this.CeId
      }; // 参数
      const res = GetEntrustRecentList(option); // 调用请求传参
      res.then(data => {
        if (Verification.handleData(data)) {
          this.CurrentEntrustList = data.Data.CurrentEntrustList;
        }
        // 成功
        // console.log(data);
      });
      res.catch(err => {
        // 失败
        console.log(err);
      });
    },
    clck(a){
      if(this.isck){
        this.isck = false;
        if(a){
          this.DoEntrustFn();
        } else {
          this.EntrustFn();
        }
        setTimeout(data=>{
          this.isck = true;
        }, 2000);
      }
    },
    // 买入请求
    DoEntrustFn () {
      if (this.popupVisible) {
        if (!this.SafePwd) {
          this.$toast({
            message: "请输入密码",
            position: 'top',
            duration: 2000
          });
          return
        }
      }
      let option = {
        CeId: this.CeId,
        IsBuy: 1,
        SafePwd: this.SafePwd,
        EntrustPrice: this.buyPrice,
        EntrustVolume: this.buyVolume
      }; // 参数
      const res = DoEntrust(option); // 调用请求传参
      res.then(data => {
        if (!data.Status) {
          this.SafePwd = '';
        }
        if (Verification.handleData(data)) {
          this.popupVisible = false;
          this.$toast({
            className: "delect",
            message: "买入成功",
            duration: 2000
          });
          this.GetEntrustRecentListFn ();
          this.buyVolume = '';
          this.SafePwd = '';
          this.buyPrice = '';
          this.allbuy = '';
          this.getData()
        }
        // 成功
        // console.log(data);
      });
      res.catch(err => {
        // 失败
        console.log(err);
      });
    },
    // 卖出入请求
    EntrustFn () {
      if (this.popupVisible) {
        if (!this.SafePwd) {
          this.$toast({
            message: "请输入密码",
            position: 'top',
            duration: 2000
          });
          return
        }
      }
      let option = {
        CeId: this.CeId,
        IsBuy: 0,
        SafePwd: this.SafePwd,
        EntrustPrice: this.price,
        EntrustVolume: this.volume
      }; // 参数
      const res = DoEntrust(option); // 调用请求传参
      res.then(data => {
        if (!data.Status) {
          this.SafePwd = '';
        }
        if (Verification.handleData(data)) {
          this.popupVisible = false;
          this.$toast({
            className: "delect",
            message: "卖出成功",
            duration: 2000
          });
          this.GetEntrustRecentListFn();
          this.price = '';
          this.SafePwd = '';
          this.volume = '';
          this.all = '';
          this.getData()
        }
        // 成功
        // console.log(data);
      });
      res.catch(err => {
        // 失败
        console.log(err);
      });
    },
    buyFn(is) {
      if (is) {
        if (!this.buyPrice) {
          this.$toast({
            message: "请先填入正确的价格",
            position: 'top',
            duration: 2000
          });
          return
        }
        if (this.buyVolume=='NaN') {
          this.$toast({
            message: "请填入正确的数量",
            position: 'top',
            duration: 2000
          });
          return
        }
        if (!this.buyVolume) {
          this.$toast({
            message: "请填入正确的数量",
            position: 'top',
            duration: 2000
          });
          return
        }
        if (this.buyVolume=='0.000000') {
          this.buyVolume=''
          this.$toast({
            message: "请填入正确的数量",
            position: 'top',
            duration: 2000,
          });
          return
        }
      } else {
        if (!this.price) {
          this.$toast({
            message: "请先填入正确的价格",
            position: 'top',
            duration: 2000
          });
          return
        }
        if (!this.volume) {
          this.$toast({
            message: "请填入正确的数量",
            position: 'top',
            duration: 2000
          });
          return
        }
        if (this.volume=='0.0' || this.volume=='0.00' || this.volume=='0.000' || this.volume=='0.0000' ||this.volume=='0.00000') {
          this.$toast({
            message: "请填入正确的数量",
            position: 'top',
            duration: 2000
          });
          return
        }
      }
      // this.popupVisible = true;
      let option = {}; // 参数
      const res = GetTradeStrategy(option); // 调用请求传参
      res.then(data => {
        if (Verification.handleData(data)) {
          this.strategy = data.Data
          let date = +new Date();
          let storage = localStorage.getItem("time");
          if (this.strategy == "OnceSixHour") {
            if (storage == null || date - storage > 21600000) {
              localStorage.setItem("time", date);
            }
          }
          this.selectPassWord(is)
          // 成功
          // console.log(data);
        }
      });
      res.catch(err => {
        // 失败
        console.log(err);
      });
    },
    // 根据策略选择是否需要输入资金密码
    selectPassWord(is) {
      switch (this.strategy) {
        case "Everytime":
          localStorage.removeItem("time");
          var obj = JSON.parse(window.localStorage.getItem('UserInfo'))
          /*if (!obj.IsSafePwd) {
            this.$toast({
              message: "请先去设置资金密码",
              position: 'top',
              duration: 2000
            });
            return
          } else {
            this.popupVisible = true;
          }*/
          this.popupVisible = true;
          break;
        case "Never":
          localStorage.removeItem("time");
          this.popupVisible = false;
          if (is) {
            this.DoEntrustFn()
          } else {
            this.EntrustFn()
          }
          break;
        case "OnceSixHour":
          let storage = localStorage.getItem("time");
          let date = +new Date();
          if (storage == null || date - storage > 21600000) {
            /*var obj = JSON.parse(window.localStorage.getItem('UserInfo'))
            if (!obj.IsSafePwd) {
              this.$toast({
                message: "请先去设置资金密码",
                position: 'top',
                duration: 2000
              });
              return
            } else {
              this.popupVisible = true;
            }*/
            this.popupVisible = true;
          } else {
            this.popupVisible = false;
            if (is) {
              this.DoEntrustFn()
            } else {
              this.EntrustFn()
            }
          }
          break;
        default:
          break;
      }
    },
    keFn (a) {
      if (a) {
        if (this.buyVolume==''){
          document.getElementById('inpp').value='';
          return
        };
        if (this.buyVolume > this.Avail / this.buyPrice) {
          this.buyVolume = (this.Avail / this.buyPrice).toFixed(6)
          this.$toast({
            message: "买入量大于可用量，已为您填充最大量！",
            position: 'top',
            duration: 2000
          });
          this.allbuy = (this.buyPrice * this.buyVolume).toFixed(6)
        } else {
          this.allbuy = (this.buyPrice * this.buyVolume).toFixed(6)
        }
      } else {
        if (this.volume==''){
          document.getElementById('ip').value='';
          return
        };
        /*if (this.volume > this.Available / this.price) {
          this.volume = (this.Available / this.price).toFixed(6)
          this.$toast({
            message: "卖出量大于可用量，已为您填充最大量！",
            position: 'top',
            duration: 2000
          });
        } else {
          this.all = (this.price * this.volume).toFixed(6)
        }*/
        if (this.volume > this.Available) {
          this.volume = this.Available;
          this.$toast({
            message: "卖出量大于可用量，已为您填充最大量！",
            position: 'top',
            duration: 2000
          });
          this.all = (this.price * this.volume).toFixed(6)
        } else {
          this.all = (this.price * this.volume).toFixed(6)
        }
      }
    },
    chan(idx) {
      for (let i = 0; i < this.tabsName.length; i++) {
        this.tabsName[i].isclick = false;
      }
      if (idx == 1) {
        this.a = true;
        this.b = false;
        this.isbuy = true;
        this.getData();
      } else {
        this.a = false;
        this.b = true;
        this.isbuy = false;
        this.getData();
      }
    },
    chanRa (index, a) {
      if (a) {
        if (!this.buyPrice) {
          this.$toast({
            message: "请先填入价格",
            position: 'top',
            duration: 2000
          });
          return
        }
        var Bnum = (this.Avail / this.buyPrice).toFixed(6)
        var Snum = '';
        Snum = Bnum.substr(0, Bnum.length - 1)
        this.buyVolume = (Snum * parseInt(this.tabsName[index].name) * 0.01).toFixed(6)
        this.allbuy = (this.buyPrice * this.buyVolume).toFixed(6)
      } else {
        this.volume = this.Available * parseInt(this.tabsName[index].name) * 0.01
        this.all = (this.price * this.volume).toFixed(6)
      }
      for (let i = 0; i < this.tabsName.length; i++) {
        if (index == i) {
          this.tabsName[i].isclick = true;
        } else {
          this.tabsName[i].isclick = false;
        }
      }
    },
    compare (x, y) {//比较函数
      if (x.price < y.price) {
        return 1;
      } else if (x.price > y.price) {
        return -1;
      } else {
        return 0;
      }
    },
    updateMarket() {
      // 全盘市场数据刷新
      var self = this;
      wsBus.$on("TradeData", data => {
        self.ask = data.Ask;
        self.bid = data.Bid;
        self.compArr = [];
        self.priArr = [];
        self.allArr = [];
        self.bid.forEach(data => {
          self.compArr.push(data.NoComplete);
          self.compArr.sort(self.compare)
          self.priArr.push(data.price);
          self.priArr.sort(self.compare)
          self.allArr.push({
            price: data.price,
            NoComplete: data.NoComplete
          })
          self.allArr.sort(self.compare)
        });
        self.wd2 = (parseFloat(self.allArr[2].NoComplete)/(parseFloat(self.allArr[2].NoComplete)+parseFloat(self.allArr[3].NoComplete)+parseFloat(self.allArr[4].NoComplete)+parseFloat(self.allArr[5].NoComplete)+parseFloat(self.allArr[6].NoComplete)))*178+'px';
        self.wd3 = (parseFloat(self.allArr[3].NoComplete)/(parseFloat(self.allArr[2].NoComplete)+parseFloat(self.allArr[3].NoComplete)+parseFloat(self.allArr[4].NoComplete)+parseFloat(self.allArr[5].NoComplete)+parseFloat(self.allArr[6].NoComplete)))*178+'px';
        self.wd4 = (parseFloat(self.allArr[4].NoComplete)/(parseFloat(self.allArr[2].NoComplete)+parseFloat(self.allArr[3].NoComplete)+parseFloat(self.allArr[4].NoComplete)+parseFloat(self.allArr[5].NoComplete)+parseFloat(self.allArr[6].NoComplete)))*178+'px';
        self.wd5 = (parseFloat(self.allArr[5].NoComplete)/(parseFloat(self.allArr[2].NoComplete)+parseFloat(self.allArr[3].NoComplete)+parseFloat(self.allArr[4].NoComplete)+parseFloat(self.allArr[5].NoComplete)+parseFloat(self.allArr[6].NoComplete)))*178+'px';
        self.wd6 = (parseFloat(self.allArr[6].NoComplete)/(parseFloat(self.allArr[2].NoComplete)+parseFloat(self.allArr[3].NoComplete)+parseFloat(self.allArr[4].NoComplete)+parseFloat(self.allArr[5].NoComplete)+parseFloat(self.allArr[6].NoComplete)))*178+'px';
        self.ws0 = (parseFloat(self.ask[0].NoComplete)/(parseFloat(self.ask[0].NoComplete)+parseFloat(self.ask[1].NoComplete)+parseFloat(self.ask[2].NoComplete)+parseFloat(self.ask[3].NoComplete)+parseFloat(self.ask[4].NoComplete)))*178+'px';
        self.ws1 = (parseFloat(self.ask[1].NoComplete)/(parseFloat(self.ask[0].NoComplete)+parseFloat(self.ask[1].NoComplete)+parseFloat(self.ask[2].NoComplete)+parseFloat(self.ask[3].NoComplete)+parseFloat(self.ask[4].NoComplete)))*178+'px';
        self.ws2 = (parseFloat(self.ask[2].NoComplete)/(parseFloat(self.ask[0].NoComplete)+parseFloat(self.ask[1].NoComplete)+parseFloat(self.ask[2].NoComplete)+parseFloat(self.ask[3].NoComplete)+parseFloat(self.ask[4].NoComplete)))*178+'px';
        self.ws3 = (parseFloat(self.ask[3].NoComplete)/(parseFloat(self.ask[0].NoComplete)+parseFloat(self.ask[1].NoComplete)+parseFloat(self.ask[2].NoComplete)+parseFloat(self.ask[3].NoComplete)+parseFloat(self.ask[4].NoComplete)))*178+'px';
        self.ws4 = (parseFloat(self.ask[4].NoComplete)/(parseFloat(self.ask[0].NoComplete)+parseFloat(self.ask[1].NoComplete)+parseFloat(self.ask[2].NoComplete)+parseFloat(self.ask[3].NoComplete)+parseFloat(self.ask[4].NoComplete)))*178+'px';
      });
    },
    fixFn(num) {
      if (num>1000) {
        var Number = num*0.001;
        var Number2 = Number.toFixed(3)
        num = Number2.substr(0, Number2.length - 1)
        return num + 'k'
      } else if(num>10 && num<1000) {
        var num3 = parseFloat(num).toFixed(3);
        return num3.substr(0, num3.length - 1)
      } else {
        return num
      }
    },
    keyFn(a) {
      if (a) {
        if(this.buyPrice==''){
          document.getElementById('inp').value='';
          this.allbuy = (this.buyPrice*this.buyVolume).toFixed(6)
        };
      } else {
        if(this.Price==''){
          document.getElementById('in').value='';
          this.all = (this.price*this.volume).toFixed(6)
        };
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  @import '~@/design/scoped';
.content {
  overflow: auto;
  background: #f7f9fc;
  position: fixed;
  top: 0px;
  bottom: 1.56rem;
  left: 0px;
  right: 0px;
  header {
    background: #fff;
    height: 80px;
    width: 100%;
    line-height: 80px;
    text-align: center;
    font-size: 34px;
    font-family: PingFang-SC-Bold;
    color: rgba(74, 100, 122, 1);
    .select {
      background: #fff;
      display: block;
      position: absolute;
      top: 23px;
      left: 65%;
      /*background: url(~@/assets/icon-png/select.png) center center no-repeat;*/
      width: 22px;
      height: 20px;
      @include bg-icon('select.png', 25px);
    }
    .market {
      background: #fff;
      display: block;
      position: absolute;
      top: 15px;
      right: 20px;
      @include bg-icon('market.png', 40px);
    }
  }
  .tab {
    background: #fff;
    height: 65px;
    width: 100%;
    display: flex;
    border-bottom: 1px solid #efefef;
    .col {
      color: #1dd25d;
    }
    .col2 {
      color: #f5174d;
    }
    a {
      text-align: center;
      text-decoration: none;
      flex: 1;
      height: 72px;
      line-height: 72px;
      color: #4a647a;
      font-size: 30px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      position: relative;
      div {
        width: 60%;
        height: 2px;
        margin-left: 20%;
        position: absolute;
        bottom: 2px;
      }
      .d1 {
        background: #1dd25d;
      }
      .d2 {
        background: #f5174d;
      }
    }
  }
  .warp {
    background: #fff;
    display: flex;
    div {
      padding-left: 20px;
      padding-top: 30px;
      flex: 1;
      height: 580px;
      .ipt {
        margin-top: 21px;
        border: 1px solid rgba(214, 219, 228, 1);
        width: 100%;
        height: 60px;
        padding: 0;
        input {
          margin-left: 2px;
          outline: none;
          margin-top: 2px;
          width: 75%;
          height: 55px;
          font-size: 24px;
          text-indent: 10px;
          border: none;
        }
        input:disabled {
          background-color: #fff;
        }
        span {
          font-size: 24px;
          color: #50565c;
          font-family: PingFang-SC-Medium;
        }
      }
      .cles {
        display: flex;
        width: 100%;
        height: 60px;
        padding: 40px 0 0 0;
        span {
          height: 40px;
          line-height: 40px;
          text-align: center;
          margin-right: 20px;
          flex: 1;
          font-size: 24px;
          color: #4a647a;
          border: 1px solid rgba(214, 219, 228, 1);
        }
        .active {
          background: #f5174d;
          color: #fff;
        }
        .acactive {
          background: #1dd25d;
          color: #fff;
        }
      }
      .tex {
        padding: 0;
        height: 60px;
        margin-top: 50px;
        span {
          color: #4a647a;
          font-size: 28px;
          font-family: PingFang-SC-Medium;
        }
      }
      .btn {
        width: 100%;
        height: 70px;
        background: #1dd25d;
        color: #fff;
        text-align: center;
        line-height: 70px;
        padding: 0;
        font-size: 26px;
      }
    }
    .tabl {
      ul {
        li {
          position: relative;
          height: 45px;
          font-size: 20px;
          line-height: 45px;
          span {
            font-size: 24px;
            font-weight: 500;
            font-family: SFUIDisplay-Medium;
          }
          .sply1 {
            float: left;
            color: #f5174d;
          }
          .sply2 {
            position: absolute;
            right: 10px;
            top:0px;
            color: #4a647a;
            z-index: 1999;
          }
          .plir {
            position: absolute;
            top:0px;
            right: 0px;
            height: 10px;
            z-index: 11;
            padding-left: 0;
          }
        }
        .btn {
          width: 100%;
          height: 70px;
          background: #1DD25D;
          color: #fff;
          text-align: center;
          line-height: 70px;
          padding: 0;
          border-radius: 0.053333rem;
          font-size: 0.373333rem;
          font-family: PingFang-SC-Heavy;
          font-weight: 800;
          color: #fff;
        }
      }
      .ul {
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid rgba(195, 208, 218, 1);
        li {
          span:first-child {
            color: #1dd25d;
          }
        }
      }
    }
  }
  .entrust {
    margin-top: 20px;
    padding-left: 24px;
    padding-top: 39px;
    background: #fff;
    h3 {
      font-size: 32px;
      color: #0d2b47;
      padding-bottom: 10px;
    }
    .den {
      height: 300px;
      width: 100%;
      line-height: 200px;
      text-align: center;
      span {
        padding: 20px 60px;
        font-size: 28px;
        color: #3291eb;
        font-family: PingFang-SC-Medium;
        box-shadow: 5px 5px 10px #e1e1e1;
      }
    }
    ul {
      li {
        border-bottom: 1px solid #eef2f5;
        .fir {
          margin-top: 20px;
          display: flex;
          div:first-child {
            flex: 1;
            font-size: 24px;
            font-family: PingFang-SC-Bold;
            color: #4a647a;
          }
          div:last-child {
            flex: 1;
            text-align: right;
            font-size: 24px;
            font-family: PingFang-SC-Bold;
            color: #4a647a;
            margin-right: 20px;
          }
        }
        .sed {
          margin-top: 20px;
          display: flex;
          span {
            flex: 1;
            font-size: 24px;
            color: #b5c0cb;
            margin-right: 20px;
            font-family: PingFang-SC-Medium;
          }
        }
        .trr {
          padding-bottom: 30px;
          span {
            color: #50565c;
          }
        }
      }
    }
  }
}
  .popup {
    width: 750px;
    height: 7rem;
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
      input[type="password"] {
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
      margin: 18px auto;
      background: $blue;
      border-radius: 4px;
      color: #fff;
      text-align: center;
      line-height: 80px;
    }
  }
</style>
