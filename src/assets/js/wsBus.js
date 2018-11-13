import Vue from 'vue'
import store from '@/store'
import "./hubs"
import Bus from "@/assets/js/bus";
let wsBus = window.wsBus = new Vue({
  store,
  data: {
    ws: null,
    WS_URL: '',
    from: 0,
    period: '',
    chat: '',
    connectStatus: false,
    onHistoryCallback: null,
    onRealtimeCallback: null,
    timer: null,
    tryCount: 0
  },
  computed: {
    klineSymbol() { // 币币交易symbol
      return this.$store.getters['pairs/klineSymbol']
    }
  },
  methods: {
    init() {
      let $this = this
      $.connection.hub.logging = true;
      this.chat = $.connection.exchangeHub;
      $.connection.hub.start().done(function () {
        $this.connectStatus = true;
      });

      // k线
      this.chat.client.ReceiveKline = function (res) {
        if (res.Type && res.Type === "kline") {
          $this.readerKlineNow(res);
        } else if (res.Type && res.Type === "history") {
          $this.readerKlineHistory(res);
        } else {
          console.log(res)
        }
      };

      // 最新成交
      let orderData = []
      Bus.$on("UpdateOrder", () => {
        orderData = []
      });
      this.chat.client.ReceiveOrders = message => {
        if(localStorage.getItem('CeId')){
          if(message.Data.MarketId != localStorage.getItem('CeId')) return
        }
        
        if(message.Data.Orders.length >= 20){
          orderData = message.Data.Orders
        }else{
          let ID = 0
          if(orderData.length > 0){
            ID = orderData[0].Id
          }
          let arr = message.Data.Orders.reverse();
          for (let i = 0; i < arr.length; i++) {
            if(arr[i].Id > ID){
              orderData.unshift(arr[i])
              ID = orderData[0].Id
            }
          }
        }
        $this.$emit("OrdersData", orderData)
      };

      // 深度图
      this.chat.client.ReceiveDepth = message => {
        if(localStorage.getItem('CeId')){
          if(message.Data.MarketId != localStorage.getItem('CeId')) return
        }
        $this.$emit("DepthData", message.Data)
      }

      // 买卖盘 最新市场
      this.chat.client.ReceiveTrade = message => {
        if(localStorage.getItem('CeId')){
          if(message.Data.MarketId != localStorage.getItem('CeId')) return
        }
        $this.$emit("TradeMarketData", message.Data)
        let plateObj = { Ask: $this.pushNullArr(message.Data.Ask, false), Bid: $this.pushNullArr(message.Data.Bid, true) }
        $this.$emit("TradeData", plateObj)
      }

      // 市场行情
      this.chat.client.ReceiveFullMarket = message => {
        $this.$emit("marketData", message.Data)
      };

      // 资产
      this.chat.client.UpdateAsset = () => {
        $this.$emit("UpdateAsset")
      }
    },
    async subscribeBar(onRealtimeCallback) {
      this.onRealtimeCallback = onRealtimeCallback;
    },
    async reqKlinHistory(symbol, resolution, from, to, onHistoryCallback) { // 请求k线历史数据
      let $this = this
      this.onHistoryCallback = onHistoryCallback;
      // this.from = from;
      if (resolution > 0 && resolution < 60) {
        this.period = "MIN" + resolution
      }
      else if (resolution == 60) {
        this.period = "H1";
      } else if (resolution == "D") {
        this.period = "D1";
      } else {
        console.log(this.period)
      }
      this.timer = setInterval(function () {
        $this.sendWebsocket(from, to)
      }, 500);
    },
    pushNullArr(data, type) { // 补充截取买卖盘
      if (data.length < 7) {
        let arrlength = 7 - data.length;
        for (let index = 0; index < arrlength; index++) {
          let nullObj = {
            price: "0",
            TimeSpan: 0,
            NoComplete: "0",
            amount: "0"
          };
          data.push(nullObj);
        }
        if (type) {
          data = data.reverse();
          return data;
        } else {
          return data;
        }
      } else {
        data.length = 7;
        if (type) {
          return data.reverse();
        } else {
          return data;
        }
      }
    },
    sendWebsocket(from, to) {
      if (this.connectStatus === false) {
        if (this.tryCount >= 60) {
          this.tryCount = 0;
          this.init();
          return;
        }
        this.tryCount++;
        return;
      }
      this.chat.server.init(
        this.klineSymbol,
        this.period,
        from * 1000,
        to * 1000
      );
      clearInterval(this.timer)
    },
    readerKlineNow(res) {
      let time = Number(res.Data.time)
      let open = Number(res.Data.open)
      let close = Number(res.Data.close)
      let low = Number(res.Data.low)
      let high = Number(res.Data.high)
      let vol = Number(res.Data.vol)
      if (typeof (this.onRealtimeCallback) != 'object') {
        this.onRealtimeCallback({
          time: time,
          open,
          close,
          low,
          high,
          volume: vol
        });
      }
    },
    readerKlineHistory(res) {
      let bars = [];
      let meta = {
        noData: false,
      }
      if (res.Data != 'nodata') {
        bars = res.Data.map(obj => ({
          time: Number(obj.time),
          open: Number(obj.open),
          close: Number(obj.close),
          high: Number(obj.high),
          low: Number(obj.low),
          volume: Number(obj.vol)
        }));
        if (typeof (this.onHistoryCallback) != 'object') {
          this.onHistoryCallback(bars, meta);
        }
      } else {
        meta.noData = true;
        this.onHistoryCallback(bars, meta);
      }

    }
  },
  created() {
    this.init()
  }
})

export default wsBus
