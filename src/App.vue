<template>
  <div id="app">
    <router-view/>
    <loading v-show="loadingStatus"></loading>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapMutations, mapState } = createNamespacedHelpers("pairs");
import loading from "@/components/loading";
import Bus from "@/assets/js/bus";
import Verification from "@/assets/js/Verification";
import { getUserMsg } from "@/service/account";
export default {
  name: "App",
  components: { loading },
  computed: {
    ...mapState(["loadingStatus"])
  },
  mounted() {
    this.setLoginState();
    this.setUserInfo();
  },
  methods: {
    ...mapMutations(["updateLoginStaus"]),
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
    setLoginState() {
      if (localStorage.getItem("token")) {
        this.updateLoginStaus(true);
      } else {
        this.updateLoginStaus(false);
      }
    }
  }
};
</script>

<style>
body,
ol,
ul,
h1,
h2,
h3,
h4,
h5,
h6,
p,
th,
td,
dl,
dd,
form,
fieldset,
legend,
input,
textarea,
select {
  margin: 0;
  padding: 0;
}
body {
  font: 12px "宋体", "Arial Narrow", HELVETICA;
  background: #fff;
  -webkit-text-size-adjust: 100%;
}
a {
  color: #172c45;
  text-decoration: none;
}
a:hover {
  color: #cd0200;
  text-decoration: underline;
}
em {
  font-style: normal;
}
li {
  list-style: none;
}
img {
  border: 0;
  vertical-align: middle;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
p {
  word-wrap: break-word;
}
* {
  margin: 0;
  padding: 0;
}
ul {
  list-style: none;
}
a,
a:visited,
a:focus {
  text-decoration: none;
  border: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-tap-highlight-color: transparent;
  outline: none;
}
.mint-toast-text {
  font-size: 28px;
}
body,
ol,
ul,
h1,
h2,
h3,
h4,
h5,
h6,
p,
th,
td,
dl,
dd,
form,
fieldset,
legend,
input,
textarea,
select {
  margin: 0;
  padding: 0;
}

body {
  font: 12px "宋体", "Arial Narrow", HELVETICA;
  background: #fff;
  -webkit-text-size-adjust: 100%;
}

a {
  color: #172c45;
  text-decoration: none;
}

a:hover {
  color: #cd0200;
  text-decoration: underline;
}

em {
  font-style: normal;
}

li {
  list-style: none;
}

img {
  border: 0;
  vertical-align: middle;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
}

p {
  word-wrap: break-word;
}

* {
  margin: 0;
  padding: 0;
}

ul {
  list-style: none;
}

a,
a:visited,
a:focus {
  text-decoration: none;
  border: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-tap-highlight-color: transparent;
  outline: none;
}

a:hover,
a:visited,
a:link,
a:active {
  text-decoration: none;
  color: inherit;
}
.mint-msgbox-title {
  font-size: 40px;
}
.mint-msgbox-message {
  font-size: 40px;
}
.mint-msgbox {
  height: 400px;
}
.mint-msgbox-btns {
  height: 100px;
  margin-top: 40px;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
}
.mint-msgbox-content {
  margin-top: 30px;
  border-bottom: 1px solid #fff;
}
.mint-msgbox-btn {
  font-size: 30px;
  border-top: 1px solid #ddd;
}
</style>
