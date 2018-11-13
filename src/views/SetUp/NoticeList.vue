<template>
    <div class="container">
        <header-back>{{$t('header')}}</header-back>
        <section>
          <div class="table" :style="{height:height}">
            <mt-loadmore
              :top-method="loadTop"
              :bottom-method="loadBottom"
              :bottom-all-loaded="allLoaded"
              ref="loadmore"
              :auto-fill="false"
              :bottomPullText="text"
              @bottom-status-change="handleBottomChange">
              <router-link :to="'/NoticeDetail?id='+item.ID" class="list" v-for="(item,index) in tableList" :key="index">
                <p class="title">{{item.DocTitle}}</p>
                <p class="time">{{item.CreateTime}}</p>
              </router-link>
              <div class="tips" v-show="moreTips">没有更多数据了...</div>
            </mt-loadmore>
          </div>
        </section>
    </div>
</template>
<script>
import Verification from "@/assets/js/Verification";
import headerBack from "@/components/headerBack";
import { getNewsList } from "@/service/index";
export default {
  data() {
    return {
      tableList: [],
      pageIndex: 1,
      total: 0,
      allLoaded: false,
      text: "上拉加载更多",
      moreTips: false,
      height: ""
    };
  },
  i18n: {
    messages: {
      "zh-CN": {
        header: "公告列表"
      },
      "en-US": {
        header: "notice"
      }
    }
  },
  components: { headerBack },
  mounted() {
    this.getList();
    this.height = document.documentElement.clientHeight - 60 + "px"; // 滚动dom高度
  },
  methods: {
    // 下拉刷新
    loadTop() {
      this.pageIndex = 1;
      let options = {
        pageIndex: this.pageIndex,
        typeId: 1
      };
      const res = getNewsList(options);
      res.then(data => {
        if (Verification.handleData(data)) {
          this.tableList = data.Data.DataList;
          this.total = data.Data.PageCount;
          this.$refs.loadmore.onTopLoaded();
        }
      });
      res.catch(error => {});
    },
    // 上拉加载更多
    loadBottom() {
      if (this.pageIndex == this.total) {
        this.allLoaded = true;
        this.$refs.loadmore.onBottomLoaded();
      } else {
        this.pageIndex += 1;
        let options = {
          pageIndex: this.pageIndex,
          typeId: 1
        };
        const res = getNewsList(options);
        res.then(data => {
          if (Verification.handleData(data)) {
            this.tableList = this.tableList.concat(data.Data.DataList);
            this.$refs.loadmore.onBottomLoaded();
          }
        });
        res.catch(error => {});
      }
    },
    // 初始化数据
    getList() {
      let options = {
        pageIndex: this.pageIndex,
        typeId: 1
      };
      const res = getNewsList(options);
      res.then(data => {
        if (Verification.handleData(data)) {
          this.tableList = data.Data.DataList;
          this.total = data.Data.PageCount;
        }
      });
      res.catch(error => {});
    },
    // 无更多数据
    handleBottomChange() {
      if (this.allLoaded == true) {
        this.moreTips = true;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/design/scoped";
.container {
  section {
    margin-top: 111px;
    padding: 0 30px;
    .table {
      overflow-y: scroll;
      .tips {
        line-height: 80px;
        text-align: center;
        font-size: 26px;
        color: rgba(128, 140, 153, 1);
      }
      .list {
        display: block;
        height: 158px;
        border-bottom: 1px solid #efefef;
        .title {
          font-size: 30px;
          font-weight: 500;
          color: rgba(14, 48, 76, 1);
          line-height: 72px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .time {
          font-size: 24px;
          font-weight: 500;
          color: rgba(128, 140, 153, 1);
          line-height: 72px;
        }
      }
    }
  }
}
</style>
