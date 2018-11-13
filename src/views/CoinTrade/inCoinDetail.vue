<template>
  <div>
    <div class="headCon">
      <span class="goBack"  @click="$router.go(-1)"></span>
      <span v-if="type!=5 && type!=2">{{bbUnit}}详情</span>
      <span v-if="type==5">{{datas.CurrencyUnit}}详情</span>
      <span v-if="type==2">{{datas.CurrencyUnit}}详情</span>
    </div>
    <div class="content">
      <p class="p" v-if="!type">{{datas.TradeAmount}}</p>
      <p class="p" v-if="type==1">-{{datas.TradeAmount}}</p>
      <p class="p" v-if="type==2" v-text="datas.Direction=='转出'?'-'+datas.TransferVolume:'+'+datas.TransferVolume"></p>
      <p class="p" v-if="type==5" v-text="datas.InOutType=='1'?'+'+datas.ChangeValue:'-'+datas.ChangeValue"></p>
      <div class="con">
        <div class="tabl" v-if="!type">
          <ul>
            <li>
              <p>交易类型</p>
              <p>充值</p>
            </li>
            <li>
              <p>资产类型</p>
              <p>{{datas.CurrencyName}}</p>
            </li>
            <li>
              <p>确认数</p>
              <p>{{datas.ConfirmCount}}</p>
            </li>
            <li>
              <p>状态</p>
              <p>{{datas.ConfirmedStatusName}}</p>
            </li>
            <li>
              <p>时间</p>
              <p>{{datas.CreateTime}}</p>
            </li>
            <li>
              <p>流水号</p>
              <p>{{datas.SerialNumber}}</p>
            </li>
          </ul>
        </div>
        <div class="tabl" v-if="type==1">
          <ul>
            <li>
              <p>交易类型</p>
              <p>提现</p>
            </li>
            <li>
              <p>资产类型</p>
              <p>{{bbUnit}}</p>
            </li>
            <li>
              <p>提现地址</p>
              <p>{{datas.BlockAddr}}</p>
            </li>
            <li>
              <p>状态</p>
              <p>{{datas.ConfirmedStatusName}}</p>
            </li>
            <li>
              <p>手续费</p>
              <p>{{datas.Fees}}</p>
            </li>
            <li>
              <p>时间</p>
              <p>{{datas.CreateTime}}</p>
            </li>
            <li>
              <p>流水号</p>
              <p>{{datas.SerialNumber}}</p>
            </li>
          </ul>
        </div>
        <div class="tabl" v-if="type==2">
          <ul>
            <li>
              <p>交易类型</p>
              <p>站内互转</p>
            </li>
            <li>
              <p>资产类型</p>
              <p>{{datas.CurrencyUnit}}</p>
            </li>
            <li>
              <p>状态</p>
              <p>{{datas.TransterStatusName}}</p>
            </li>
            <li>
              <p>时间</p>
              <p>{{datas.CreateTime}}</p>
            </li>
            <li>
              <p>流水号</p>
              <p>{{datas.SerialNumber || '无'}}</p>
            </li>
          </ul>
        </div>
        <div class="tabl" v-if="type==5">
          <ul>
            <li>
              <p>交易类型</p>
              <p>{{datas.RecordTypeName}}</p>
            </li>
            <!--<li>-->
              <!--<span>资产类型</span>-->
              <!--<span>{{datas.CurrencyUnit}}</span>-->
            <!--</li>-->
            <li>
              <p>资产类型</p>
              <p>{{datas.CurrencyUnit}}</p>
            </li>
            <!--<li>
              <span>状态</span>
              <span>{{datas.RecordTypeID}}</span>
            </li>-->
            <li>
              <p>时间</p>
              <p>{{datas.CreateTime}}</p>
            </li>
            <li>
              <p>流水号</p>
              <p>{{datas.SerialNumber}}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/babel">
  import Verification from "@/assets/js/Verification";
  import { GetUserDepositList } from '@/service/coinTrade';
  export default {
    data(){
      return {
        datas:'',
        bbUnit: window.localStorage.getItem('bbUnit'),
        type: 0,
      }

    },
    mounted(){
      this.datas = JSON.parse(window.localStorage.getItem('bbDetail'));
      this.type = parseInt(this.$route.query.type);
    },
    methods: {
    },
    components: {}
  }

</script>

<style lang="scss" scoped>
  @import '~@/design/scoped';
  body {
  }
  .headCon {
    height: 88px;
    line-height: 88px;
    position: relative;
    text-align: center;
    font-size: 34px;
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    color: rgba(14, 48, 76, 1);
    box-shadow: 0px 6px 12px 0px rgba(197, 210, 229, 0.27);
    background-color: #fff;
    .goBack {
      position: absolute;
      top: 28px;
      left: 30px;
      width: 30px;
      height: 30px;
      @include bg-icon('goBack.png', 30px);
    }
  }
  .content {
    .p {
      font-size:58px;
      font-family:PingFang-SC-Bold;
      color:rgba(14,48,76,1);
      text-align: center;
      margin-top: 79px;
    }
    .con {
      background: #fff;
      padding: 40px 20px;
      .tabl {
        ul {
          li {
            margin-top: 10px;
            font-size: 28px;
            p {
              font-size: 28px;
              font-weight: 600;
              font-family: SFUIDisplay-Medium;
            }
            p:first-child {
              width: 20%;
              float: left;
              color:#B5C0CB;
              text-align: left;
            }
            p:last-child {
              text-align: right;
              //float: right;
              margin-right: 20px;
              color:#0D2B47;
            }
          }
        }
      }
    }
  }
</style>
