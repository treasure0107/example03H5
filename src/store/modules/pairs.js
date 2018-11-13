export default {
  namespaced: true,
  state: {
    baseCoin: 'APPLE',
    targetCoin: 'BTC',
    CeId: '',
    loginStaus: false,
    buyCanuse: 0,
    sellCanuse: 0,
    theme:'white',
    loadingStatus:false
  },
  getters: {
    klineSymbol(state) {
      let CurrencyPair = JSON.parse(localStorage.getItem('CurrencyPair'))
      if (CurrencyPair != null) {
        state.targetCoin = CurrencyPair.targetCoin;
        state.baseCoin = CurrencyPair.baseCoin;
        return state.targetCoin + "_" + state.baseCoin;
      } else {
        return state.targetCoin + "_" + state.baseCoin;
      }

    },
    CeId(state) {
      let CeId = localStorage.getItem('CeId');
      if (CeId != null) {
        return state.CeId = CeId;
      } else {
        return state.CeId;
      }
    }
  },
  mutations: {
    updateLoginStaus(state, loginStaus) {
      state.loginStaus = loginStaus;
    },
    updateAssets(state, { buyCanuse, sellCanuse }) {
      state.buyCanuse = buyCanuse;
      state.sellCanuse = sellCanuse
    },
    updateBaseCoin(state, newBaseCoin) {
      state.baseCoin = newBaseCoin
    },
    updateTargetCoin(state, newTargetCoin) {
      state.targetCoin = newTargetCoin
    },
    updateKlineSymbol(state, { baseCoin, targetCoin, CeId }) {
      state.baseCoin = baseCoin;
      state.targetCoin = targetCoin;
      state.CeId = CeId
    },
    setTheme(state, theme){
      state.theme = theme
    },
    setLoading(state, bool){
      state.loadingStatus = bool
    }
  }
}
