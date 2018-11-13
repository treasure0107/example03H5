<!-- 倒计时 -->
<!-- endTime（结束时间） nowTime（当前服务端时间） callback（回调函数） endText（结束文字） -->
<template>
    <span :endTime="endTime" :nowTime="nowTime" :callback="callback" :endText="endText">
        <slot>
            {{content}}
        </slot>
    </span>
</template>
<script>
  export default {
    data() {
      return {
        content: ""
      };
    },
    props: {
      nowTime: {
        type: Number,
        default: ""
      },
      endTime: {
        type: Number,
        default: ""
      },
      endText: {
        type: String,
        default: "已结束"
      },
      callback: {
        type: Function,
        default: ""
      }
    },
    mounted() {
      this.countdowm(this.endTime, this.nowTime);
    },
    methods: {
      countdowm(endTime, nowTime) {
        let self = this;
        let t = (endTime) - (nowTime);
        console.log(endTime);
        console.log(nowTime);
        console.log(t);
        let timer = setInterval(function () {
          t--;
          if (t > 0) {
            let day = Math.floor(t / 86400);
            let hour = Math.floor((t / 3600) % 24);
            let min = Math.floor((t / 60) % 60);
            let sec = Math.floor(t % 60);
            hour = hour < 10 ? "0" + hour : hour;
            min = min < 10 ? "0" + min : min;
            sec = sec < 10 ? "0" + sec : sec;
            let format = "";
            if (day > 0) {
              format = `${day}天${hour}小时${min}分${sec}秒`;
            }
            if (day <= 0 && hour > 0) {
              format = `${hour}小时${min}分${sec}秒`;
            }
            if (day <= 0 && hour <= 0) {
              format = `${min}分${sec}秒`;
            }
            self.content = format;
          } else {
            clearInterval(timer);
            self.content = self.endText;
            self._callback();
          }
        }, 1000);
      },
      _callback() {
        if (this.callback && this.callback instanceof Function) {
          this.callback(...this);
        }
      }
    }
  };
</script>
