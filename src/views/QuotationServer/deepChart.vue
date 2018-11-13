<template>
    <div id="chart-root"></div>
</template>

<script>
import wsBus from "@/assets/js/wsBus";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapGetters } = createNamespacedHelpers("pairs");
export default {
  name: "depth-char-comp",
  data() {
    return {
      chart: null,
      color: "",
      price: "",
      vol: "",
      isShow: false
    };
  },
  computed: {
    ...mapState(["baseCoin", "targetCoin"]),
    ...mapGetters(["klineSymbol"])
  },
  watch: {
    klineSymbol() {
      this.chart.setOption({
        tooltip: {
          formatter: params => {
            let isBuySeries = params.length === 2;
            let data = params[0].data;
            let color = isBuySeries ? "color-buy" : "color-sell";
           return `<span style="color:#FFF;font-size:12px;">委托价 <span>${(+params[0]
              .axisValue).toFixed(6)} ${this.baseCoin}</span><br/>
                    累积量 <span class="${color} ml-15">${data.toFixed(2)} ${
              this.targetCoin
            }</span></span>`;
          }
        },
        textStyle: {
          color: "#61688a"
        },
        xAxis: {
          data: []
        },
        yAxis: {
        },
        series: [
          {
            data: []
          },
          {
            data: []
          }
        ]
      });
    }
  },
  methods: {
    chartInit() {
      // 基于准备好的dom，初始化echarts实例
      let chart = (this.chart = window.echarts.init(
        document.getElementById("chart-root")
      ));

      // 指定图表的配置项和数据
      let option = {
        animation: false,
        // smooth: false,
        grid: {
          top: 40,
          bottom: 55,
          left: 50,
          right: 80
        },
        tooltip: {
          show: true,
          trigger: "axis",
          //   backgroundColor: "#262a42",
          //   padding: [10, 15],
          axisPointer: {
            type: "line",
            lineStyle: {
              type: "dashed",
              color: "#61688a"
            }
          },
          formatter: params => {
            let isBuySeries = params.length === 2;
            let data = params[0].data;
            let color = isBuySeries ? "color-buy" : "color-sell";
            // this.color = isBuySeries ? "color-buy" : "color-sell";
            // this.price = (+params[0].axisValue).toFixed(6);
            // this.vol = data.toFixed(2);
            return `<span style="color:#FFF;font-size:12px;">委托价 <span>${(+params[0]
              .axisValue).toFixed(6)} ${this.baseCoin}</span><br/>
                    累积量 <span class="${color} ml-15">${data.toFixed(2)} ${
              this.targetCoin
            }</span></span>`;
          },
          textStyle: {
            color: "#61688a"
          }
        },
        textStyle: {
          color: "#61688a"
        },
        xAxis: {
            name: `委单价格（${this.baseCoin}）`,
            nameTextStyle: {
              padding: [15, 0, 0]
            },
            nameLocation: "center",
          type: "category",
          //   axisLabel: {
          //     rotate: 15
          //   },
          data: []
        },
        yAxis: {
            name: `累积量（${this.targetCoin}）`,
          axisLabel: {
            formatter(value) {
              return `${(value / 1000).toFixed(3)}K`;
            }
            // inside:true
          },
          type: "value",
          position: "right",
          splitNumber: 0,
          splitLine: {
            show: false
          }
        },
        series: [
          {
            name: "buy",
            type: "line",
            showSymbol: false,
            emphasis: {
              itemStyle: {
                color: "#589065",
                // borderWidth: 0,
                borderColor: "#fff"
              }
            },
            lineStyle: {
              width: 0,
              color: "#589065"
            },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    // color: "#589065" // 0% 处的颜色
                    color: "#E9F9EF"
                  },
                  {
                    offset: 1,
                    // color: "#181b2a" // 100% 处的颜色
                    color: "#E9F9EF"
                  }
                ]
              }
            },
            data: []
          },
          {
            name: "sell",
            type: "line",
            showSymbol: false,
            emphasis: {
              itemStyle: {
                color: "#ae4e54",
                borderWidth: 0,
                borderColor: "#fff"
              }
            },
            lineStyle: {
              width: 0,
              color: "#ae4e54"
            },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "#f9e9ee" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#f9e9ee" // 100% 处的颜色
                  }
                ]
              }
            },
            data: []
          }
        ]
      };

      // 使用刚指定的配置项和数据显示图表。
      chart.setOption(option);
      window.onresize = this.chart.resize;
      this.subscribeDepth();
    },
    subscribeDepth() {
      let onOff = true;
      wsBus.$on("DepthData", tick => {
        let ask,bid;
        if(tick.Ask.length > 15){
          tick.Ask.length = 15
        }
        ask = tick.Ask;
        if(tick.Bid.length > 15){
          tick.Bid.length = 15
        }
        bid = tick.Bid;
        if (onOff) {
          onOff = false;
          let asksTotal = 0;
          let bidsTotal = 0;
          let xData = [];
          let bids = [];
          if (ask.length > 0) {
            for (let index = 0; index < ask.length; index++) {
              xData.unshift(Number(ask[index].price));
              bidsTotal += Number(ask[index].NoComplete);
              bids.unshift(bidsTotal);
            }
          }
          let asks = [];
          if (bid.length > 0) {
            for (let index = 0; index < bid.length; index++) {
              xData.push(Number(bid[index].price));
              asksTotal += Number(bid[index].NoComplete);
              asks.push(asksTotal);
            }
            asks = new Array(bids.length).concat(asks);
          }
          this.chart.setOption({
            xAxis: {
              data: xData
            },
            series: [{ data: bids }, { data: asks }]
          });
          onOff = true;
        }
      });
    }
  },
  mounted() {
    this.chartInit();
  }
};
</script>
<style scoped>
#chart-root {
  width: 750px;
  height: 400px;
}
</style>
