# webApp

## 项目结构
``` bash
# src/assets
项目静态文件

# src/axios
项目请求封装

# src/component
公用组件

# src/config
根据开发环境配置请求URL

# src/design
封装公共sass样式

# src/service
项目请求

# src/store
vuex状态存储

# src/views
项目页面文件

# src/views/Index
主页

# src/views/Login
登录/注册/忘记密码

# src/views/SetUp
设置

# src/views/Users
个人中心
```
## 项目运行打包
``` bash
推荐使用yarn
# 安装modules
yarn
# or
npm install

# 运行
yarn start
# or
npm run dev

# 打包
yarn build
# or
npm run build

# 本地运行打包文件(需安装node服务器)
cd dist
http-server

