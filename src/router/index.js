import Vue from 'vue'
import Router from 'vue-router'

import Index from '@/views/Index/index' // 首页

import ContractTrade from '@/views/ContractTrade/contractTrade' // 合约

import CoinTrade from '@/views/CoinTrade/coinTrade' // 币币
import entrust from '@/views/CoinTrade/entrust' // 币币
import entrustDetail from '@/views/CoinTrade/entrustDetail' // 币币
import accountCoin from '@/views/CoinTrade/accountCoin' // 币币
import chooseCoin from '@/views/CoinTrade/chooseCoin' // 币币
import serCoin from '@/views/CoinTrade/serCoin' // 币币
import inCoin from '@/views/CoinTrade/inCoin' // 币币
import inCoinDetail from '@/views/CoinTrade/inCoinDetail' // 币币
import inCoinList from '@/views/CoinTrade/inCoinList' // 币币
import outCoin from '@/views/CoinTrade/outCoin' // 币币
import deposit from '@/views/CoinTrade/deposit' // 币币
import outCoinAdr from '@/views/CoinTrade/outCoinAdr' // 币币
import transfer from '@/views/CoinTrade/transfer' // 币币
import sfer from '@/views/CoinTrade/sfer' // 币币
import purseAdr from '@/views/CoinTrade/purseAdr' // 币币
import addUsdtAdr from '@/views/CoinTrade/addUsdtAdr' // 币币
import dealerList from '@/views/CoinTrade/dealerList' // 币币

import CurrencytTrade from '@/views/CurrencytTrade/currencytTrade' // 法币
import orderDetails from '@/views/CurrencytTrade/orderDetails' // 法币
import appeal from '@/views/CurrencytTrade/appeal' // 法币(发起)
import merchantHome from '@/views/CurrencytTrade/merchantHome' // 法币 商家主页
import orderRecord from '@/views/CurrencytTrade/orderRecord' // 法币
import accountFiat from '@/views/CurrencytTrade/accountFiat' // 法币账户
import receivingSet from '@/views/CurrencytTrade/receivingSet' // 法币(收款设置)
import addBankCard from '@/views/CurrencytTrade/addBankCard' // 法币
import addAlipay from '@/views/CurrencytTrade/addAlipay' // 法币
import tradingRecord from '@/views/CurrencytTrade/tradingRecord' // 法币(交易记录)
import blacklist from '@/views/CurrencytTrade/blacklist' // 法币(黑名单)
import advertisingManagement from '@/views/CurrencytTrade/advertisingManagement' // 广告管理
import advertisingIssue from '@/views/CurrencytTrade/advertisingIssue' // 发布广告
import advertisingDetails from '@/views/CurrencytTrade/advertisingDetails' // 广告管理详情
import currencyList from '@/views/CurrencytTrade/currencyList' // 法币列表
import transferFunds from '@/views/CurrencytTrade/transferFunds' // 法币列表
import transferRecord from '@/views/CurrencytTrade/transferRecord' // 法币列表
import orderRecordDetails from '@/views/CurrencytTrade/orderRecordDetails' // 法币列表

import UserIndex from '@/views/Users/userIndex' // 个人中心
import ModifyPhone from '@/views/Users/modifyPhone' // 绑定修改手机
import ModifyEmail from '@/views/Users/modifyEmail' // 绑定修改邮箱
import ModifyPassword from '@/views/Users/modifyPassword' // 修改登陆密码
import ModifySafe from '@/views/Users/modifySafe' // 修改设置资金密码
import ForgetSafe from '@/views/Users/forgetSafe' // 忘记资金密码
import SetUp from '@/views/SetUp/setUp' // 设置
import Guide from '@/views/SetUp/guide' // 指导列表
import GuideDetail from '@/views/SetUp/guideDetail' // 指导详情
import RateDetail from '@/views/SetUp/rateDetail' // 费率
import AboutUs from '@/views/SetUp/aboutUs' // 关于我们
import NoticeList from '@/views/SetUp/NoticeList' // 公告列表
import NoticeDetail from '@/views/SetUp/NoticeDetail' // 公告列表

import Login from '@/views/Login/login' // 登录
import Forget from '@/views/Login/Forget' // 忘记密码
import Register from '@/views/Login/register' // 注册
import Agreement from '@/views/Login/Agreement' // 用户协议
import Policy from '@/views/Login/policy' // 用户协议

import QuotationServer from '@/views/QuotationServer/QuotationServer' // 行情
import MarketList from '@/views/QuotationServer/marketList' // 行情币种选择
import Search from '@/views/QuotationServer/search' // 搜索
import QuotationDetail from '@/views/QuotationServer/QuotationDetail' // 行情详情页


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/QuotationServer',
      name: 'QuotationServer',
      component: QuotationServer
    },
    {
      path: '/MarketList',
      name: 'MarketList',
      component: MarketList
    },
    {
      path: '/Search',
      name: 'Search',
      component: Search
    },
    {
      path: '/QuotationDetail',
      name: 'QuotationDetail',
      component: QuotationDetail
    },
    {
      path: '/ContractTrade',
      name: 'ContractTrade',
      component: ContractTrade
    },
    {
      path: '/CoinTrade',
      name: 'CoinTrade',
      component: CoinTrade
    },
    {
      path: '/entrust',
      name: 'entrust',
      component: entrust
    },
    {
      path: '/entrustDetail',
      name: 'entrustDetail',
      component: entrustDetail
    },
    {
      path: '/accountCoin',
      name: 'accountCoin',
      component: accountCoin
    },
    {
      path: '/chooseCoin',
      name: 'chooseCoin',
      component: chooseCoin
    },
    {
      path: '/serCoin',
      name: 'serCoin',
      component: serCoin
    },
    {
      path: '/inCoin',
      name: 'inCoin',
      component: inCoin
    },
    {
      path: '/inCoinDetail',
      name: 'inCoinDetail',
      component: inCoinDetail
    },
    {
      path: '/inCoinList',
      name: 'inCoinList',
      component: inCoinList
    },
    {
      path: '/outCoin',
      name: 'outCoin',
      component: outCoin
    },
    {
      path: '/outCoinAdr',
      name: 'outCoinAdr',
      component: outCoinAdr
    },
    {
      path: '/deposit',
      name: 'deposit',
      component: deposit
    },
    {
      path: '/transfer',
      name: 'transfer',
      component: transfer
    },
    {
      path: '/sfer',
      name: 'sfer',
      component: sfer
    },
    {
      path: '/CurrencytTrade',
      name: 'CurrencytTrade',
      component: CurrencytTrade
    },
    {
      path: '/purseAdr',
      name: 'purseAdr',
      component: purseAdr
    },
    {
      path: '/addUsdtAdr',
      name: 'addUsdtAdr',
      component: addUsdtAdr
    },
    {
      path: '/dealerList',
      name: 'dealerList',
      component: dealerList
    },
    {
      path: '/orderDetails',
      name: 'orderDetails',
      component: orderDetails
    },
    {
      path: '/appeal',
      name: 'appeal',
      component: appeal
    },
    {
      path: '/merchantHome',
      name: 'merchantHome',
      component: merchantHome
    },
    {
      path: '/orderRecord',
      name: 'orderRecord',
      component: orderRecord
    },
    {
      path: '/orderRecordDetails',
      name: 'orderRecordDetails',
      component: orderRecordDetails
    },
    {
      path: '/accountFiat',
      name: 'accountFiat',
      component: accountFiat
    },
    {
      path: '/receivingSet',
      name: 'receivingSet',
      component: receivingSet
    },
    {
      path: '/transferFunds',
      name: 'transferFunds',
      component: transferFunds
    },
    {
      path: '/tradingRecord',
      name: 'tradingRecord',
      component: tradingRecord
    },
    {
      path: '/blacklist',
      name: 'blacklist',
      component: blacklist
    },
    {
      path: '/advertisingManagement',
      name: 'advertisingManagement',
      component: advertisingManagement
    },
    {
      path: '/advertisingIssue',
      name: 'advertisingIssue',
      component: advertisingIssue
    },
    {
      path: '/advertisingDetails',
      name: 'advertisingDetails',
      component: advertisingDetails
    },
    {
      path: '/currencyList',
      name: 'currencyList',
      component: currencyList
    },
    {
      path: '/transferRecord',
      name: 'transferRecord',
      component: transferRecord
    },
    {
      path: '/addBankCard',
      name: 'addBankCard',
      component: addBankCard
    },
    {
      path: '/addAlipay',
      name: 'addAlipay',
      component: addAlipay
    },
    {
      path: '/UserIndex',
      name: 'UserIndex',
      component: UserIndex
    },
    {
      path: '/ModifyPhone',
      name: 'ModifyPhone',
      component: ModifyPhone
    },
    {
      path: '/ModifyEmail',
      name: 'ModifyEmail',
      component: ModifyEmail
    },
    {
      path: '/ModifyPassword',
      name: 'ModifyPassword',
      component: ModifyPassword
    },
    {
      path: '/ModifySafe',
      name: 'ModifySafe',
      component: ModifySafe
    },
    {
      path: '/ForgetSafe',
      name: 'ForgetSafe',
      component: ForgetSafe
    },
    {
      path: '/SetUp',
      name: 'SetUp',
      component: SetUp
    },
    {
      path: '/Guide',
      name: 'Guide',
      component: Guide
    },
    {
      path: '/GuideDetail',
      name: 'GuideDetail',
      component: GuideDetail
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/Forget',
      name: 'Forget',
      component: Forget
    },
    {
      path: '/Register',
      name: 'Register',
      component: Register
    },
    {
      path: '/Agreement',
      name: 'Agreement',
      component: Agreement
    },
    {
      path: '/Policy',
      name: 'Policy',
      component: Policy
    },
    {
      path: '/RateDetail',
      name: 'RateDetail',
      component: RateDetail,
    },
    {
      path: '/AboutUs',
      name: 'AboutUs',
      component: AboutUs,
    },
    {
      path: '/NoticeList',
      name: 'NoticeList',
      component: NoticeList,
    },
    {
      path: '/NoticeDetail',
      name: 'NoticeDetail',
      component: NoticeDetail,
    },
  ]
})
