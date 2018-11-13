<template>
  <div class="trade-view-comp cont-box">
    <div id="trade-view-root">
    </div>
  </div>
</template>

<script>
import Datafeeds from "@/assets/js/myDatafeeds";
import { createNamespacedHelpers } from "vuex";
let { mapGetters, mapState } = createNamespacedHelpers("pairs");

export default {
  name: "kline-comp",
  computed: {
    ...mapState(["baseCoin", "targetCoin", "marketMessage"]),
    ...mapGetters(["klineSymbol"])
  },
  watch: {
    klineSymbol() {
      this.tradingViewInit();
    }
  },
  methods: {
    tradingViewInit() {
      let widget = new window.TradingView.widget({
        // eslint-disable-line
        // debug: true, // uncomment this line to see Library errors and warnings in the console
        width: "100%",
        height: "100%",
        fullscreen: false,
        symbol: this.klineSymbol,
        interval: localStorage.getItem("tradingview.interval") || "15",
        container_id: "trade-view-root",
        datafeed: new Datafeeds(this.klineSymbol),
        library_path: "/static/chartTool/",
        locale: "zh",
        timezone: "Asia/Hong_Kong",
        drawings_access: {
          type: "black",
          tools: [{ name: "Regression Trend" }]
        },
        disabled_features: [
          // 'main_series_scale_menu',
          "pane_context_menu",
          // "header_fullscreen_button", // 全屏
          "go_to_date",
          "header_compare",
          "header_chart_type",
          "header_indicators",
          "header_settings",
          "header_interval_dialog_button",
          "header_screenshot",
          "header_symbol_search",
          "header_undo_redo",
          // 'legend_context_menu',
          // 'show_hide_button_in_legend',
          // 'show_interval_dialog_on_key_press',
          // 'snapshot_trading_drawings',
          "symbol_info",
          "volume_force_overlay",
          "items_favoriting",
          "header_layouttoggle",
          // 'chart_crosshair_menu',
          // 'open_account_manager',
          // 'study_dialog_search_control',
          "symbol_search_hot_key",
          "control_bar",
          // 'header_settings',
          "save_chart_properties_to_local_storage",
          "display_market_status",
          "timeframes_toolbar",
          "use_localstorage_for_settings"
          // "header_widget_dom_node", // 头部控制栏
        ],
        enabled_features: [
          // 'study_templates',
          // 'timeframes_toolbar',
          // 'dont_show_boolean_study_arguments',
          "hide_last_na_study_output",
          // 'same_data_requery',
          // 'side_toolbar_in_fullscreen_mode',
          "hide_left_toolbar_by_default"
        ],
        studies_overrides: {},
        charts_storage_api_version: "1.1",
        client_id: "tradingview.com",
        user_id: "public_user_id",
        // loading_screen: {
        //   backgroundColor: "#181b2a"
        // },
        toolbar_bg: "#F7F9FC",
        overrides: {
          volumePaneSize: "small",
          "paneProperties.legendProperties.showStudyValues": true,
          "paneProperties.legendProperties.showLegend": false, // 隐藏MA值
          "paneProperties.background": "#fff"
          // "paneProperties.vertGridProperties.color": "#1f2943",
          // "paneProperties.horzGridProperties.color": "#1f2943",
          // "symbolWatermarkProperties.transparency": 90,
          // "scalesProperties.textColor": "#61688a",
          // 实心k
          // "mainSeriesProperties.candleStyle.upColor": "#589065",
          // "mainSeriesProperties.candleStyle.downColor": "#ae4e54",
          // "mainSeriesProperties.candleStyle.drawWick": true,
          // "mainSeriesProperties.candleStyle.drawBorder": true,
          // "mainSeriesProperties.candleStyle.borderColor": "#C400CB",
          // "mainSeriesProperties.candleStyle.borderUpColor": "#589065",
          // "mainSeriesProperties.candleStyle.borderDownColor": "#ae4e54",
          // "mainSeriesProperties.candleStyle.wickUpColor": "#589065",
          // "mainSeriesProperties.candleStyle.wickDownColor": "#ae4e54",
          // 空心k
          // "mainSeriesProperties.hollowCandleStyle.upColor": "#589065",
          // "mainSeriesProperties.hollowCandleStyle.downColor": "#ae4e54",
          // "mainSeriesProperties.hollowCandleStyle.drawWick": true,
          // "mainSeriesProperties.hollowCandleStyle.drawBorder": true,
          // "mainSeriesProperties.hollowCandleStyle.borderColor": "#C400CB",
          // "mainSeriesProperties.hollowCandleStyle.borderUpColor": "#589065",
          // "mainSeriesProperties.hollowCandleStyle.borderDownColor": "#ae4e54",
          // "mainSeriesProperties.hollowCandleStyle.wickUpColor": "#589065",
          // "mainSeriesProperties.hollowCandleStyle.wickDownColor": "#ae4e54",
          // "scalesProperties.lineColor": "#61688a",

          // "paneProperties.legendProperties.showSeriesTitle": false // 取消symbolInfo
        }
        // custom_css_url: "./night.css"
      });
      widget.onChartReady(() => {
        let chart = widget.activeChart();
        chart.createStudy("Moving Average", false, false, [5], null, {
          "Plot.color": "#965fc4",
          "Plot.linewidth": 1
        });
        chart.createStudy("Moving Average", false, false, [10], null, {
          "Plot.color": "#84aad5",
          "Plot.linewidth": 1
        });
        chart.createStudy("Moving Average", false, false, [30], null, {
          "Plot.color": "#55b263",
          "Plot.linewidth": 1
        });
        chart.createStudy("Moving Average", false, false, [60], null, {
          "Plot.color": "#b7248a",
          "Plot.linewidth": 1
        });
        chart.onIntervalChanged().subscribe(null, (interval, obj) => {
          localStorage.setItem("tradingview.interval", interval);
        });

        // const buttonEvent = widget.createButton({ align: "right" });
        // const button = buttonEvent[0];
        // button.className = "button fullscreen iconed apply-common-tooltip";
        // buttonEvent.append($("<span>打开/关闭全屏</span>")); //图片地址
        // button.onclick = function() {
        //   const tvid = $("#trade-view-root")[0];
          
        //   if (tvid.className == "") {
        //     tvid.className = "tv_chart_container_full"
        //     return;
        //   }else{
        //     tvid.className = ''
        //   }
        // };
      });
    }
  },
  mounted() {
    this.tradingViewInit();
  }
};
</script>
<style>
#trade-view-root {
  width: 750px;
  height: 600px;
}
/* .header-chart-panel .left{display:flex !important;justify-content: space-between !important} */
</style>
