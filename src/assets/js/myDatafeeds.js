import wsBus from './wsBus'
const supportedResolutions = ['1', '5', '15', '30', '60', 'D'];
export default class {
  constructor (symbol) {
    // this.symbol = symbol
    this.lastBar = null;
  }
  //
  async onReady (callback) {
    let config = await Promise.resolve({
      supports_search: false,
      supports_group_request: false,
      supported_resolutions: supportedResolutions,
      supports_marks: false,
    });
    callback(config);
  }
  
  unsubscribeBars (subscriberUID) {
    //console.log('unsubscribeBars =====>\n', ...arguments)
  }
  async resolveSymbol (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
    let res = await Promise.resolve({
      name: symbolName,
      ticker: symbolName,
      type: 'bitcoin',
      "timezone": 'Asia/Hong_Kong',
      "minmov": 1, // 最小波动
      "pricescale": 100, // 价格刻度
      // "minmov2": 0.0001,
      // "pointvalue": 0.00000001,
      "session": "24x7",
      "has_intraday": true,
      // "has_no_volume":false,
      // "description":"Apple Inc.",
      "supported_resolutions": supportedResolutions,
      // "intraday_multipliers": ['5', '15', '30', '60'],
      'has_empty_bars': true
    });
    onSymbolResolvedCallback(res);
  }
  async getBars (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
    wsBus.reqKlinHistory(symbolInfo.name, resolution, from, to,onHistoryCallback)
  }
  subscribeBars (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) {
    wsBus.subscribeBar(onRealtimeCallback);
    wsBus.$on('subscribeBar', klines => {
      // let {time, open, close, low, high, vol} = klines.Data
      let time = Number(klines.Data.time)
      let open = Number(klines.Data.open)
      let close = Number(klines.Data.close)
      let low = Number(klines.Data.low)
      let high = Number(klines.Data.high)
      let vol = Number(klines.Data.vol)
      onRealtimeCallback({
        time: time * 1000,
        open,
        close,
        low,
        high,
        volume: vol
      });
    });
  }
}
