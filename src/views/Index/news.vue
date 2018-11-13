<template>
    <div class="news">
        <div class="left">
            <div class="icon"></div>
            <div class="title">
                <ul :class="{anim:animate==true}">
                    <li v-for="(item,index) in list" :key="index"><router-link :to="'/NoticeDetail?id='+item.ID">{{item.DocTitle}}</router-link></li>
                </ul>
            </div>
        </div>
        <router-link to="/NoticeList" class="more"></router-link>
    </div>
</template>
<script>
import Verification from "@/assets/js/Verification";
import { getNewsList } from "@/service/index";
export default {
  name: "news",
  data() {
    return {
      animate: false,
      list: []
    };
  },
  mounted() {
    this.getList();
    setInterval(this.scroll, 2000);
  },
  methods: {
    scroll() {
      this.animate = true;
      setTimeout(() => {
        this.list.push(this.list[0]);
        this.list.shift();
        this.animate = false;
      }, 500);
    },
    getList() {
      let options = {
        pageIndex: 1,
        typeId: 1
      };
      const res = getNewsList(options);
      res.then(data => {
        if (Verification.handleData(data)) {
          this.list = data.Data.DataList;
        }
      });
      res.catch(error => {});
    }
  }
};
</script>
 <style lang="scss" scoped>
@import "~@/design/scoped";
.news {
  height: 85px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #efefef;
  .left {
    display: flex;
    align-items: center;
    .icon {
      @include bg-icon("news.png", 26px, 28px);
    }
    .title {
      font-size: 26px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(80, 86, 92, 1);
      margin-left: 19px;
      height: 30px;
      overflow: hidden;
      ul {
        width: 550px;
        white-space: nowrap;
        text-overflow: ellipsis;
        height: 30px;
        line-height: 30px;
        li {
          width: 550px;
          height: 30px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          line-height: 30px;
        }
      }
      .anim {
        transition: all 0.5s;
        margin-top: -30px;
      }
    }
  }
  .more {
    display: block;
    @include bg-icon("newsMore.png", 32px);
  }
}
</style>
 