<template>
  <div>
    <div class="headCon">
      <span class="goBack" @click="goBack"></span>
      <span v-show="item.OrderStatus=='Applying'">未支付</span>
      <span v-show="item.OrderStatus=='Paid'">已支付</span>
      <span v-show="item.OrderStatus=='Completed'">已完成</span>
      <span v-show="item.OrderStatus=='Cancel'">已取消</span>
      <span v-if="item.OrderStatus=='Complaint'">申诉中</span>
      <span class="cancel" @click="cancelOrder" v-if="isBuy && item.OrderStatus=='Applying'">取消订单</span>
    </div>
    <!--未付款-->
    <div v-if="item.OrderStatus=='Applying'" class="main">
      <div class="news clearFl">
        <div class="con-l total-con">
          <p class="totalPrice">¥{{toDecimal(item.Price * item.Volume)}}</p>
          <p class="total-u">交易总额</p>
        </div>
        <div class="con-r total-con">
          <p><span class="con-tit">单价</span><span class="price">¥{{toDecimal(item.Price)}}</span></p>
          <p><span class="con-tit">数量</span>
            <span class="amount" v-if="item.CoinUnit=='APPLE'">{{toDecimal(item.Volume)}} {{item.CoinUnit}}</span>
            <span class="amount" v-else>{{item.Volume}} {{item.CoinUnit}}</span>
          </p>
        </div>
      </div>
      <div class="payment-mode" v-for="(param,index) in PaymentLst" v-if="isBuy">
        <div v-if="isBank&&param.PaymentType=='Bank'">
          <div class="p-tit" @click="PayPal(param.Id)">
            <span class="p-img p-b-img"></span>
            <span class="p-m">银行卡</span>
            <span class="p-a"></span>
          </div>
          <ul>
            <li>
              <span class="p-c-tit">银行名称</span><span class="p-c-c">{{param.BankName}}</span>
            </li>
            <li>
              <span class="p-c-tit">支行</span><span class="p-c-c">{{param.BankAddress}}</span>
            </li>
            <li>
              <span class="p-c-tit">收款人</span><span class="p-c-c">{{param.TrueName}}
              <span class="copy tag-read1" :data-clipboard-text="param.TrueName" @click="copy(1)" type='text'></span>
            </span>
            </li>
            <li>
              <span class="p-c-tit">银行卡号</span><span class="p-c-c"> {{param.BankCard}}
                 <span class="copy tag-read2" :data-clipboard-text="param.BankCard" @click="copy(2)" type='text'></span>
            </span>
            </li>
            <li>
              <span class="p-c-tit">备注号 </span>
              <span class="query-icon" @click="query"></span>
              <span class="p-c-c">
                <span>{{OrderId}}</span>
                  <span class="copy tag-read1" :data-clipboard-text="OrderId" @click="copy(1)" type='text'></span>
              </span>
            </li>
          </ul>
        </div>
        <div v-if="!isBank&&param.PaymentType=='Alipay'">
          <div class="p-tit" @click="PayPal(param.Id)">
            <span class="p-img p-a-img"></span>
            <span class="p-m">支付宝</span>
            <span class="p-a"></span>
          </div>
          <ul>
            <li>
              <span class="p-c-tit">收款人</span><span class="p-c-c">{{param.TrueName}}
              <span class="copy tag-read1" :data-clipboard-text="param.TrueName" @click="copy(1)" type='text'></span>
            </span>
            </li>
            <li>
              <span class="p-c-tit">账号</span><span class="p-c-c">{{param.AlipayAccount}}
              <span class="copy tag-read1" :data-clipboard-text="param.AlipayAccount" @click="copy(1)"
                    type='text'></span>
            </span>
            </li>
            <li>
              <span class="p-c-tit">备注号</span> <span class="query-icon" @click="query"></span>
              <span class="p-c-c">
                <span>{{OrderId}}</span>
                  <span class="copy tag-read1" :data-clipboard-text="OrderId" @click="copy(1)" type='text'></span>
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div class="icon" v-if="isBuy">
        请在规定的时间内完成付款，如果您已向对方转账付款，请务必点“我已付款"按钮，否则有可能会造成资金损失。
      </div>
      <div style="text-align: center;">
        <span class="Countdown">剩余：
          <span v-if="item.BizSystemTime&&item.BizExpirationTime">
            <countDown :nowTime="item.BizSystemTime" :endTime="item.BizExpirationTime" :callback="callbackApplying"
                       :endText="'0分0秒'">
            </countDown>
          </span>
        </span>
      </div>
      <div class="btn">
        <mt-button type="primary" :disabled="isDisabled" size="large" v-if="isBuy&&callbackApply"
                   @click="haveUpdateOrderStatus('Paid')">
          我已付款
        </mt-button>
      </div>
      <div class="contact-con">
        <span @click="merchantHome(item.MerchantUserId)">{{MerchantUserName}}</span>
        <span class="phoneNum" @click="callPhone">联系他 <span class="phonePic"></span> </span>
      </div>
      <div class="icon-t">
        <p class="icon-t-tit">温馨提示：</p>
        <div v-if="isBuy">
          <p> 1、您的汇款将直接进入卖方账户，交易过程中卖方出售的数字资产由平台托管保护。</p>
          <p> 2、请在规定时间内完成付款，并务必点击“我已付款”，卖方确认收款后，系统会将数字资产划转到您的账户。</p>
          <p>3、如果买方当日取消订单达3次，将会被限制当日的买入功能。</p>
        </div>
        <div v-if="!isBuy">1、如商家未在规定时间内付款，订单将会自动取消，交易币将退回您的账户。</div>
      </div>
    </div>
    <!--已付款-->
    <div v-if="item.OrderStatus=='Paid'" class="main">
      <div class="news clearFl">
        <div class="con-l total-con">
          <p class="totalPrice">¥{{toDecimal(item.Price * item.Volume)}}</p>
          <p class="total-u">交易总额</p>
        </div>
        <div class="con-r total-con">
          <p><span class="con-tit">单价</span><span class="price">¥{{toDecimal(item.Price)}}</span></p>
          <p><span class="con-tit">数量</span>
            <span class="amount" v-if="item.CoinUnit=='APPLE'">{{toDecimal(item.Volume)}} {{item.CoinUnit}}</span>
            <span class="amount" v-else>{{item.Volume}} {{item.CoinUnit}}</span>
          </p>
        </div>
      </div>
      <div class="payment-mode" v-for="(param,index) in PaymentLst" v-if="isBuy">
        <div v-if="param.PaymentType=='Bank'">
          <div class="p-tit p-tit-paid">
            <div class="p-c-tit">收款方式</div>
            <div>
              <span class="p-img p-b-img"></span>
              <span class="p-m">银行卡</span>
            </div>
          </div>
          <ul>
            <li>
              <span class="p-c-tit">银行名称</span><span class="p-c-c">{{param.BankName}}</span>
            </li>
            <li>
              <span class="p-c-tit">支行</span><span class="p-c-c">{{param.BankAddress}}</span>
            </li>
            <li>
              <span class="p-c-tit">收款人</span><span class="p-c-c">{{param.TrueName}}
              <span class="copy tag-read1" :data-clipboard-text="param.TrueName" @click="copy(1)" type='text'></span>
            </span>
            </li>
            <li>
              <span class="p-c-tit">银行卡号</span><span class="p-c-c"> {{param.BankCard}}
                <span class="copy tag-read2" :data-clipboard-text="param.BankCard" @click="copy(2)" type='text'></span>
            </span>
            </li>
            <li>
              <span class="p-c-tit">备注号</span>
              <span class="query-icon" @click="query"></span>
              <span class="p-c-c">
              <span>{{OrderId}}</span>
               <span class="copy tag-read1" :data-clipboard-text="OrderId" @click="copy(1)" type='text'></span>
              </span>
            </li>
          </ul>
        </div>
        <div v-if="param.PaymentType=='Alipay'">
          <div class="p-tit p-tit-paid">
            <div class="p-c-tit">收款方式</div>
            <div>
              <span class="p-img p-a-img"></span>
              <span class="p-m">支付宝</span>
            </div>
          </div>
          <ul>
            <li>
              <span class="p-c-tit">收款人</span><span class="p-c-c">{{param.TrueName}}
             <span class="copy tag-read1" :data-clipboard-text="param.TrueName" @click="copy(1)" type='text'></span>
            </span>
            </li>
            <li>
              <span class="p-c-tit">账号</span><span class="p-c-c">{{param.AlipayAccount}}
               <span class="copy tag-read1" :data-clipboard-text="param.AlipayAccount" @click="copy(1)"
                     type='text'></span>
            </span>
            </li>
            <li>
              <span class="p-c-tit">备注号</span> <span class="query-icon" @click="query"></span>
              <span class="p-c-c">
                <span>{{OrderId}}</span>
                    <span class="copy tag-read1" :data-clipboard-text="OrderId" @click="copy(1)" type='text'></span>
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div class="payment-mode" v-for="(param,index) in PaymentLst" v-if="!isBuy">
        <div v-if="param.PaymentType=='Bank'">
          <div class="p-tit p-tit-paid">
            <div class="p-c-tit">收款方式</div>
            <div>
              <span class="p-img p-b-img"></span>
              <span class="p-m">银行卡</span>
            </div>

          </div>
          <ul>
            <li>
              <span class="p-c-tit">订单号</span><span class="p-c-c">{{item.OrderNumber}}</span>
            </li>
            <li>
              <span class="p-c-tit">备注号</span>
              <span class="query-icon" @click="query"></span>
              <span class="p-c-c">
                <span>{{OrderId}}</span>
               <span class="copy tag-read1" :data-clipboard-text="OrderId" @click="copy(1)" type='text'></span>
              </span>
            </li>
          </ul>
        </div>
        <div v-if="param.PaymentType=='Alipay'">
          <div class="p-tit p-tit-paid">
            <div class="p-c-tit">收款方式</div>
            <div>
              <span class="p-img p-a-img"></span>
              <span class="p-m">支付宝</span>
            </div>

          </div>
          <ul>
            <!--<li>-->
            <!--<span class="p-c-tit">付款人</span><span class="p-c-c">{{param.TrueName}}-->
            <!--<span class="copy tag-read1" :data-clipboard-text="param.TrueName" @click="copy(1)" type='text'></span>-->
            <!--</span>-->
            <!--</li>-->
            <li>
              <span class="p-c-tit">账号</span><span class="p-c-c">{{param.AlipayAccount}}
                <span class="copy tag-read1" :data-clipboard-text="param.AlipayAccount" @click="copy(1)"
                      type='text'></span>
              </span>
            </li>
            <li>
              <span class="p-c-tit">备注号</span> <span class="query-icon" @click="query"></span>
              <span class="p-c-c">
                {{OrderId}}
                  <span class="copy tag-read1" :data-clipboard-text="OrderId" @click="copy(1)" type='text'></span>
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div style="text-align: center;margin-top: 60px;" v-if="isBuy">
        <span class="Countdown">剩余：
           <span v-if="item.BizSystemTime&&item.BizExpirationTime">
                  <countDown :nowTime="item.BizSystemTime" :endTime="item.BizExpirationTime" :callback="callbackAppeal"
                             :endText="'0分0秒'">
                  </countDown>
              </span>
          等待对方放币
        </span>
      </div>
      <div class="btn">
        <mt-button type="primary" size="large" @click="sureCol" v-if="!isBuy">确认收款</mt-button>

        <mt-button style="background-color: #F28136;" class="sureBtn" type="primary" size="large" v-if="isBuy&&isAppeal"
                   @click="appeal">
          申诉
        </mt-button>
        <div class="icon-btn" v-if="!isBuy">未收到款 ？发起 <a href="javascript:void(0);" @click="appeal">申诉</a></div>
      </div>
      <div class="contact-con">
        <span @click="merchantHome(item.MerchantUserId)">{{MerchantUserName}}</span>
        <span class="phoneNum" @click="callPhone">联系他 <span class="phonePic"></span> </span>
      </div>
      <div class="icon-t" v-if="!isBuy">
        <p class="icon-t-tit">温馨提示：</p>
        <div>1、如商家未在规定时间内付款，订单将会自动取消，交易币将退回您的账户。</div>
      </div>
    </div>
    <!--已完成-->
    <div v-if="item.OrderStatus=='Completed'" class="main">
      <div class="news clearFl">
        <div class="con-l total-con">
          <p class="totalPrice">¥{{toDecimal(item.Price * item.Volume)}}</p>
          <p class="total-u">交易总额</p>
        </div>
        <div class="con-r total-con">
          <p><span class="con-tit">单价</span><span class="price">¥{{toDecimal(item.Price)}}</span></p>
          <p><span class="con-tit">数量</span>
            <span class="amount" v-if="item.CoinUnit=='APPLE'">{{toDecimal(item.Volume)}} {{item.CoinUnit}}</span>
            <span class="amount" v-else>{{item.Volume}} {{item.CoinUnit}}</span>
          </p>
        </div>
      </div>
      <div class="payment-mode">
        <div>
          <ul>
            <li>
              <span class="p-c-tit">备注号</span> <span class="query-icon" @click="query"></span>
              <span class="p-c-c">{{item.OrderId}}  </span>
            </li>
            <li>
              <span class="p-c-tit">下单时间</span>
              <span class="p-c-c">{{item.CreateTime}}</span>
            </li>
            <li>
              <span class="p-c-tit">订单号</span>
              <span class="p-c-c">{{item.OrderNumber}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="contact-con" @click="merchantHome(item.MerchantUserId)">
        <span>{{MerchantUserName}}</span>
        <span class="phoneNum"><span class="arrowPic"></span></span>
      </div>
      <div class="icon-t icon-t-i-s" v-if="item.IussueStatus==1">
        <div class="icon-t-tit">申诉结果：<span class="t-s">胜诉</span></div>
        <div class="i-t-c">
          <p>原因：<span>交易币已划转至您的账户</span></p>
          <p>如有疑问，请联系客服。</p>
        </div>
      </div>
      <div class="icon-t icon-t-i-s" v-if="item.IussueStatus==-1">
        <div class="icon-t-tit">申诉结果：<span class="t-f">败诉</span></div>
        <div class="i-t-c">
          <p>原因：<span>经审核后，确认买方已付款！</span></p>
          <p>如有疑问，请联系客服。</p>
        </div>
      </div>
    </div>
    <!--已取消-->
    <div v-if="item.OrderStatus=='Cancel'" class="main">
      <div class="news clearFl">
        <div class="con-l total-con">
          <p class="totalPrice">¥{{toDecimal(item.Price * item.Volume)}}</p>
          <p class="total-u">交易总额</p>
        </div>
        <div class="con-r total-con">
          <p><span class="con-tit">单价</span><span class="price">¥{{toDecimal(item.Price)}}</span></p>
          <p><span class="con-tit">数量</span>
            <span class="amount" v-if="item.CoinUnit=='APPLE'">{{toDecimal(item.Volume)}} {{item.CoinUnit}}</span>
            <span class="amount" v-else>{{item.Volume}} {{item.CoinUnit}}</span>
          </p>
        </div>
      </div>
      <div class="payment-mode">
        <div>
          <ul>
            <li>
              <span class="p-c-tit">备注号</span> <span class="query-icon" @click="query"></span>
              <span class="p-c-c">{{OrderId}}  </span>
            </li>
            <li>
              <span class="p-c-tit">下单时间</span>
              <span class="p-c-c">{{item.CreateTime}}</span>
            </li>
            <li>
              <span class="p-c-tit">订单号</span>
              <span class="p-c-c">{{item.OrderNumber}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="contact-con" @click="merchantHome(item.MerchantUserId)">
        <span>{{MerchantUserName}}</span>
        <span class="phoneNum"><span class="arrowPic"></span></span>
      </div>
      <div class="icon-t icon-t-i-s" v-if="item.IussueStatus==1">
        <div class="icon-t-tit">申诉结果：<span class="t-s">胜诉</span></div>
        <div class="i-t-c">
          <p>原因：<span>确认对方未付款，订单取消</span></p>
          <p>如有疑问，请联系客服。</p>
        </div>
      </div>
      <div class="icon-t icon-t-i-s" v-if="item.IussueStatus==-1">
        <div class="icon-t-tit">申诉结果：<span class="t-f">败诉</span></div>
        <div class="i-t-c">
          <p>原因：<span>经确认，您未付款，订单已取消</span></p>
          <p>如有疑问，请联系客服。</p>
        </div>
      </div>
    </div>
    <!--已申诉-->
    <div v-if="item.OrderStatus=='Complaint'" class="main">
      <div class="news clearFl">
        <div class="con-l total-con">
          <p class="totalPrice">¥{{toDecimal(item.Price * item.Volume)}}</p>
          <p class="total-u">交易总额</p>
        </div>
        <div class="con-r total-con">
          <p><span class="con-tit">单价</span><span class="price">¥{{toDecimal(item.Price)}}</span></p>
          <p><span class="con-tit">数量</span>
            <span class="amount" v-if="item.CoinUnit=='APPLE'">{{toDecimal(item.Volume)}} {{item.CoinUnit}}</span>
            <span class="amount" v-else>{{item.Volume}} {{item.CoinUnit}}</span>
          </p>
        </div>
      </div>
      <!--    <div class="payment-mode" v-for="(param,index) in PaymentLst" v-if="isBuy">
        <div v-if="param.PaymentType=='Bank'">
          <div class="p-tit p-tit-icon">
            <div>付款方式</div>
            <div>
              <span class="p-img p-b-img"></span>
              <span class="p-m">银行卡</span>
            </div>
          </div>
          <ul>
            <li>
              <span class="p-c-tit">银行名称</span><span class="p-c-c">{{param.BankName}}</span>
            </li>
            <li>
              <span class="p-c-tit">支行</span><span class="p-c-c">{{param.BankAddress}}</span>
            </li>
            <li>
              <span class="p-c-tit">收款人</span><span class="p-c-c">{{param.TrueName}}
              <span class="copy tag-read1" :data-clipboard-text="param.TrueName" @click="copy(1)" type='text'></span>
            </span>
            </li>
            <li>
              <span class="p-c-tit">银行卡号</span><span class="p-c-c"> {{param.BankCard}}
             <span class="copy tag-read1" :data-clipboard-text="param.BankCard" @click="copy(1)" type='text'></span>
            </span>
            </li>
            <li>
              <span class="p-c-tit">备注号</span>
              <span class="query-icon" @click="query"></span>
              <span class="p-c-c">
                <span>{{OrderId}}</span>
               <span class="copy tag-read1" :data-clipboard-text="OrderId" @click="copy(1)" type='text'></span>
              </span>
            </li>
          </ul>
        </div>
        <div v-if="param.PaymentType=='Alipay'">
          <div class="p-tit-icon">
            <div>付款方式</div>
            <div>
              <span class="p-img p-b-img"></span>
              <span class="p-m">支付宝</span>
            </div>
          </div>
          <ul>
            <li>
              <span class="p-c-tit">收款人</span><span class="p-c-c">{{param.TrueName}}
            <span class="copy tag-read1" :data-clipboard-text="param.TrueName" @click="copy(1)" type='text'></span>
            </span>
            </li>
            <li>
              <span class="p-c-tit">账号</span><span class="p-c-c">{{param.AlipayAccount}}
              <span class="copy tag-read1" :data-clipboard-text="param.AlipayAccount" @click="copy(1)"
                    type='text'></span>
            </span>
            </li>
            <li>
              <span class="p-c-tit">备注号</span> <span class="query-icon" @click="query"></span>
              <span class="p-c-c">
                <span>{{OrderId}}</span>
              <span class="copy tag-read1" :data-clipboard-text="OrderId" @click="copy(1)" type='text'></span>
              </span>
            </li>
          </ul>
        </div>
      </div>-->
      <!--<div class="payment-mode" v-for="(param,index) in PaymentLst" v-if="!isBuy">
        <div v-if="param.PaymentType=='Bank'">
          <div class="p-tit-icon">
            <div class="p-c-tit">收款方式</div>
            <div>
              <span class="p-img p-b-img"></span>
              <span class="p-m">银行卡</span>
            </div>

          </div>
          <ul>

            <li>
              <span class="p-c-tit">订单号</span><span class="p-c-c">{{item.OrderNumber}}</span>
            </li>
            <li>
              <span class="p-c-tit">付款人</span><span class="p-c-c">{{param.TrueName}}
              <span class="copy tag-read1" :data-clipboard-text="param.TrueName" @click="copy(1)" type='text'></span>
            </span>
            </li>
            <li>
              <span class="p-c-tit">备注号</span>
              <span class="query-icon" @click="query"></span>
              <span class="p-c-c">
                <span>{{OrderId}}</span>
                <span class="copy tag-read1" :data-clipboard-text="OrderId" @click="copy(1)" type='text'></span>
              </span>
            </li>
          </ul>
        </div>
        <div v-if="param.PaymentType=='Alipay'">
          <div class="p-tit-icon">
            <div class="p-c-tit">收款方式</div>
            <div>
              <span class="p-img p-a-img"></span>
              <span class="p-m">支付宝</span>
            </div>

          </div>
          &lt;!&ndash;<ul>&ndash;&gt;
            &lt;!&ndash;<li>&ndash;&gt;
              &lt;!&ndash;<span class="p-c-tit">付款人</span><span class="p-c-c">{{param.TrueName}}&ndash;&gt;
                &lt;!&ndash;<span class="copy tag-read1" :data-clipboard-text="param.TrueName" @click="copy(1)" type='text'></span>&ndash;&gt;
            &lt;!&ndash;</span>&ndash;&gt;
            &lt;!&ndash;</li>&ndash;&gt;
            &lt;!&ndash;<li>&ndash;&gt;
              &lt;!&ndash;<span class="p-c-tit">账号</span><span class="p-c-c">{{param.AlipayAccount}}&ndash;&gt;
             &lt;!&ndash;<span class="copy tag-read2" :data-clipboard-text="param.AlipayAccount" @click="copy(2)"&ndash;&gt;
                   &lt;!&ndash;type='text'></span>&ndash;&gt;
            &lt;!&ndash;</span>&ndash;&gt;
            &lt;!&ndash;</li>&ndash;&gt;
            &lt;!&ndash;<li>&ndash;&gt;
              &lt;!&ndash;<span class="p-c-tit">备注号</span> <span class="query-icon" @click="query"></span>&ndash;&gt;
              &lt;!&ndash;<span class="p-c-c">&ndash;&gt;
                &lt;!&ndash;<span>{{OrderId}}</span>&ndash;&gt;
                &lt;!&ndash;<span class="copy tag-read1" :data-clipboard-text="OrderId" @click="copy(1)" type='text'></span>&ndash;&gt;
              &lt;!&ndash;</span>&ndash;&gt;
            &lt;!&ndash;</li>&ndash;&gt;
          &lt;!&ndash;</ul>&ndash;&gt;
        </div>
      </div>-->
      <div style="text-align: center;margin-top: 30px;" v-if="isIussueStatus">
        <span class="Countdown">剩余：
          <span v-if="item.BizSystemTime&&item.BizExpirationTime">
            <countDown :nowTime="item.BizSystemTime || 0" :endTime="item.BizExpirationTime || 0" :callback="callback"
                       :endText="'0分0秒'"></countDown>
          </span>
           内上传凭证
        </span>
      </div>
      <div class="btn">
        <mt-button style="margin-bottom: 30px;" class="sureBtn" type="primary" size="large"
                   v-if="isIussueStatus" @click="appeal()">上传凭证
        </mt-button>
        <mt-button type="primary" style="background-color: #fff; color:#F28136; border: 1px solid #F28136;" size="large"
                   v-if="!isBuy" @click="sureCol">确认收款
        </mt-button>

        <mt-button style="margin-bottom: 30px;background-color: #80878e;" class="sureBtn" type="primary" size="large"
                   v-if="!isIussueStatus">已上传凭证
        </mt-button>
        <!--<mt-button style="background-color: #F28136;margin-bottom: 30px;" class="sureBtn" type="primary" size="large"-->
        <!--v-if="item.IussueStatus==''"  @click="appeal()">申诉-->
        <!--</mt-button>-->
      </div>
      <div class="contact-con">
        <span @click="merchantHome(item.MerchantUserId)">{{MerchantUserName}}</span>
        <span class="phoneNum" @click="callPhone">联系他 <span class="phonePic"></span> </span>
      </div>
      <div class="icon-n">
        <div><span></span></div>
        <div>
          订单申诉中，<span v-if="IssueUserId==Userid">申诉结果由客服审核之后判定</span>
          <span v-else>申诉原因：<span>{{item.IussueType}}</span></span>!
        </div>
      </div>
      <div class="icon-t" v-if="isIussueStatus">
        <p class="icon-t-tit">温馨提示：</p>
        <div>
          若您在24小时内没有配合处理，则判定您败诉，资金损失由您承担。
          <!--订单申诉中，请耐心等待客服审核，申诉结果将会发送短信至已绑定的手机号。-->
        </div>
      </div>

    </div>
    <!--选择支付方式-->
    <mt-popup
      v-model="popupVisiblePay"
      position="bottom" class="popupVisiblePay">
      <div v-for="(item,index) in PaymentLst">
        <div class="popup-item" v-if="item.PaymentType=='Bank'" @click="payment('Bank',item.Id)">银行卡</div>
        <div class="popup-item" v-if="item.PaymentType=='Alipay'" @click="payment('Alipay',item.Id)">支付宝</div>
      </div>
      <div class="line-popup"></div>
      <div class="popup-item" @click="popupVisiblePay=false;">取消</div>
    </mt-popup>
    <!--备注号-->
    <mt-popup
      v-model="popupVisibleQuery"
      class="popupVisibleQuery">
      <div class="popup-tit">请在付款信息中备注付款备注号</div>
      <div class="popBtn" @click="popupVisibleQuery=false;">{{$t('know')}}</div>
    </mt-popup>
    <!--取消订单弹窗-->
    <mt-popup v-model="popupVisibleOrder">
      <div class="popupVisibleOrder">
        <div class="popup-tit">
          取消订单
        </div>
        <div class="popup-con">
          如买方当日取消订单达3次，将会被限制当日的买入功能
          <div class="popup-con-icon">
            <span v-show="!isCheckbox" class="checkboxUn" @click="noCheckBox"></span>
            <span v-show="isCheckbox" class="checkedbox" @click="isCheckBox"></span>
            <span> 我确认还没有付款给对方</span>
          </div>
        </div>
        <div class="popBtn">
          <div @click="popupVisibleOrder=false;">{{$t('cancel')}}</div>
          <div v-if="isCheckbox" @click="cancelUpdateOrderStatus('Cancel')">{{$t('sure')}}</div>
          <div v-if="!isCheckbox" style="color:#ADB7C1;">{{$t('sure')}}</div>
        </div>
      </div>
    </mt-popup>
    <!--拨打手机号码-->
    <mt-popup
      v-model="popupVisiblePhone"
      class="popupVisiblePhone">
      <div class="popupVisiblePhone">
        <div class="popup-tit">
          {{Mobile}}
        </div>
        <div class="popBtn">
          <div @click="popupVisiblePhone=false;">取消</div>
          <div><a href="tel:Mobile"> 呼叫</a></div>
        </div>
      </div>
    </mt-popup>
    <!--输入资金密码-->
    <mt-popup
      v-model="popupVisibleCollection"
      position="bottom"
      class="popupVisible">
      <div>
        <div class="popup-tit">
          <span class="pop-tit">请输入资金密码</span> <span class="cancel" @click="popupVisibleCollection = false;">取消</span>
        </div>
        <div class="moneyPassword">
          <input type="password" placeholder="请输入资金密码" class="password" v-model="SafePwd">
        </div>
        <div class="popBtn">
          <router-link to="/ForgetSafe" class="forgetPassword">忘记密码？</router-link>
          <mt-button class="sureBtn" type="primary" size="large" @click="sureCollection('Completed')">确定</mt-button>
        </div>
      </div>
    </mt-popup>
  </div>
</template>
<script type="text/babel">
  import {QueryOrderInfoById, UpdateOrderStatus, GetUserInfo} from "@/service/CurrencytTrade";
  import countDown from '@/components/countDown';
  import {createNamespacedHelpers} from "vuex";
  import Verification from "@/assets/js/Verification";
  const {mapState, mapMutations} = createNamespacedHelpers("pairs");
  import {InfiniteScroll, Popup, Toast} from 'mint-ui';
  import Clipboard from 'clipboard';
  export default {
    data(){
      return {
        popupVisiblePay: false,
        popupVisibleQuery: false,
        popupVisibleOrder: false,
        popupVisibleCollection: false,
        popupVisiblePhone: false,
        isCheckbox: false,
        id: '',
        item: {
          Price: 0,
          Volume: 0
        },
        itemData: {},
        bankType: false,
        AlipayType: false,
        PaymentLst: [],
        OrderId: '',
        isBank: true,
        isBuy: true,
        PaymentId: '',
        IdBank: '',
        IdAlipay: '',
        isAppeal: false,
        SafePwd: '',
        isIussueStatus: true,
        callbackApply: true,
        isDisabled: false,
        Userid: '',
        IssueUserId: '',
        Mobile: '',
        OrderType: '',
        entrustId: '',
        MerchantUserName: ''
      }
    },

    mounted() {
      this.id = this.$route.query.id;
      this.OrderType = this.$route.query.type;
      if (this.OrderType == 1) {
        this.entrustId = this.$route.query.entrustId;
      }
      this.getUserInfo();
      this.getData();
      /*this.setDefaultLanguage();*/
    },
    i18n: {
      messages: {
        "zh-CN": {
          lang: "中文",
          know: '知道了',
          sure: '确定',
          cancel: '取消',

        },
        "en-US": {
          lang: "English",
          know: 'know',
          sure: 'sure',
          cancel: 'cancel',
        }
      }
    },
    methods: {
      ...mapMutations([
        'setTheme'
      ]),
      getUserInfo() {   //获取用户详情
        let option = {}; // 参数
        const res = GetUserInfo(option); // 调用请求传参
        res.then(data => {   // 成功
//          console.log(data.Data);
          if (Verification.handleData(data)) {
//            console.log(data.Data);
            this.Userid = data.Data.UserID;
          }

        });
        res.catch(err => {  // 失败
          console.log(err);
        });
      },
      copy(n){   //复制方法
        if (n == 1)
          var clipboard = new Clipboard('.tag-read1');
        if (n == 2)
          var clipboard = new Clipboard('.tag-read2');
        this.$toast({
          message: "复制成功！",
          duration: 2000
        });
        clipboard.on('success', e => {
          //这里你如果引入了elementui的提示就可以用，没有就注释即可
          // 释放内存
          clipboard.destroy()
        });
        clipboard.on('error', e => {
          // 不支持复制
          console.log('该浏览器不支持自动复制');
          // 释放内存
          clipboard.destroy()
        })
      },
      callbackApplying(){
        this.callbackApply = false;  //未支付，倒计时隐藏支付按钮
      },
      callback(){

      },
      callbackAppeal(){   //申诉倒计时为0，显示按钮
        this.isAppeal = true;
      },
      sureCol(){  //确认收款(弹窗显示)
        this.popupVisibleCollection = true;
      },
      sureCollection(param){   //输入资金密码确认收款
        this.popupVisibleCollection = false;
        if (!this.SafePwd) {
          this.$toast({
            message: "资金密码不能为空！",
            duration: 1000,
            position: 'top'
          });
          return false;
        }
        let option = {
          OrderId: this.id,
          OrderStatus: param,
          SafePwd: this.SafePwd
        }; // 参数
        const res = UpdateOrderStatus(option); // 调用请求传参
        res.then(data => {   // 成功
          if (Verification.handleData(data)) {
            this.popupVisibleCollection = false;
            this.getData();
          }
        });
        res.catch(err => {
          // 失败
          console.log(err);
        });
      },
      toDecimal(decimal){   //保留两位小数
        if (decimal == '') {
          decimal = 0;
        }
        return Number(decimal).toFixed(3).slice(0, -1);
      },
      goBack(){   //返回按钮
        if (this.OrderType == 3) {
          this.$router.push({path: '/orderRecord'});
        }
        if (this.OrderType == 1) {
//          this.$router.go(-1);
          this.$router.push({path: '/advertisingDetails', query: {entrustId: this.entrustId}});
        }
      },
      appeal(){   //跳转申诉（上传凭证）
        if (this.OrderType == 1) {
          this.$router.push({
            path: '/appeal',
            query: {id: this.OrderId, entrustId: this.entrustId, type: this.OrderType}
          });
        } else {
          this.$router.push({path: '/appeal', query: {id: this.OrderId, type: this.OrderType}});
        }
      },
      cancelOrder(){   //点击取消订单按钮，弹窗显示
        this.popupVisibleOrder = true;
      },
      sure(){   //隐藏取消订单弹窗
        if (this.isCheckbox) {
          this.popupVisibleOrder = false;
        }
      },
      PayPal(id){   //点击选择支付方式
        this.popupVisiblePay = true;
      },
      payment(type, PaymentId){   //弹窗显示，选择支付方式
        this.popupVisiblePay = false;
        this.PaymentId = PaymentId;
        if (type == 'Bank') {
          this.isBank = true;
        }
        if (type == 'Alipay') {
          this.isBank = false;
        }
      },
      query(){   //备注号（显示）
        this.popupVisibleQuery = true;
      },
      isCheckBox(){   //是否勾选
        this.isCheckbox = false;
      },
      noCheckBox(){   //是否勾选
        this.isCheckbox = true;
      },
      callPhone(){   //点击拨电话弹窗
        this.popupVisiblePhone = true;
      },
      merchantHome(MerchantUserId){   //跳转到商家首页
        if (this.OrderType == 3) {
          this.$router.push({path: '/merchantHome', query: {id: MerchantUserId}});
        }
      },
      haveUpdateOrderStatus(param){   //我已付款
        this.isDisabled = true;
        setTimeout(() => {
          this.isDisabled = false
        }, 3000);
        let option = {
          OrderId: this.id,
          PaymentId: this.PaymentId,
          OrderStatus: param,
        }; // 参数
        const res = UpdateOrderStatus(option); // 调用请求传参
        res.then(data => {   // 成功
          if (Verification.handleData(data)) {
            this.$toast({
              message: data.Data.Msg || "付款成功！",
              duration: 900,
              position: 'top'
            });
            setTimeout(() => {
              this.getData();
            }, 1000);
          }
        });
        res.catch(err => {
          // 失败
          console.log(err);
        });
      },
      cancelUpdateOrderStatus(param){    //点击确定，取消订单
        this.popupVisibleOrder = false;
        let option = {
          OrderId: this.id,
//          PaymentId: this.PaymentId,
          OrderStatus: param,
        }; // 参数
        const res = UpdateOrderStatus(option); // 调用请求传参
        res.then(data => {   // 成功
          if (Verification.handleData(data)) {
            this.$toast({
              message: data.Data.Msg || "取消成功！",
              duration: 600,
              position: 'top'
            });
            setTimeout(() => {
              this.getData();
            }, 900);
          }
        });
        res.catch(err => {
          // 失败
          console.log(err);
        });
      },
      getData() {   //获取订单详情数据
        let option = {
          orderid: this.id
        }; // 参数
        const res = QueryOrderInfoById(option); // 调用请求传参
        res.then(data => {   // 成功
          if (Verification.handleData(data)) {
            this.item = data.Data;
//            console.log(this.item);
            this.IssueUserId = this.item.IssueUserId;
            this.OrderId = this.item.OrderId;
            this.isBuy = this.item.IsBuyer;
            if (this.item.IsBuyer) {
              this.itemData = this.item.Buyer;
              this.Mobile = this.item.Seller.Mobile;
              this.MerchantUserName = this.item.Seller.NickName;
            } else {
              this.itemData = this.item.Seller;
              this.Mobile = this.item.Buyer.Mobile;
              this.MerchantUserName = this.item.Buyer.NickName;
            }
            /*      if (this.item.Tradetype == 'Sell') {
             this.itemData = this.item.Buyer;
             this.isBuy = false;
             }
             if (this.item.Tradetype == 'Buy') {
             this.itemData = this.item.Seller;
             this.isBuy = true;
             }*/
//            console.log(this.item);
            if (this.item.IussueStatus == '') {
              this.isIussueStatus = true;
            }
            if (this.item.IussueStatus === '0') {
              this.isIussueStatus = false;
            }
            if (data.Data.PaymentLst) {
              this.PaymentLst = data.Data.PaymentLst;
              this.PaymentLst.forEach((param, i) => {
                if (param.PaymentType == 'Bank') {
//                  this.bankType = true;
                  this.isBank = true;
                  this.IdBank = param.Id;
                }
                if (param.PaymentType == 'Alipay') {
//                  this.AlipayType = true;
                  this.isBank = false;
                  this.IdAlipay = param.Id;
                }
                if (this.isBank) {
                  this.PaymentId = this.IdBank;
                } else {
                  this.PaymentId = this.IdAlipay;
                }
              })
            }
            /*         if (data.Data.PaymentTypes) {
             data.Data.PaymentTypes.forEach((param, i) => {
             if (param == 'Bank') {
             this.bankType = true;
             this.isBank = true;
             }
             if (param == 'Alipay') {
             this.AlipayType = true;
             }
             })
             }*/
          }
        });
        res.catch(err => {
          // 失败
          console.log(err);
        });
      },
      setDefaultLanguage() {
        const cookieLanguage = this.$_cookie.get("language");
        if (cookieLanguage) {
          this.setLanguage(cookieLanguage);
        } else {
          this.setLanguage("zh-CN");
        }
      },
      // 设置语言
      setLanguage(language) {
        switch (language) {
          case "zh-CN":
            this.$i18n.locale = "zh-CN";
            this.$_cookie.set("language", "zh-CN");
            break;
          case "en-US":
            this.$i18n.locale = "en-US";
            this.$_cookie.set("language", "en-US");
            break;
          default:
            break;
        }
      },
      set (themeName) {
        this.setTheme(themeName)
        localStorage.setItem('theme', themeName)
      },
    }
    ,
    computed: {
      ...
        mapState([
          'theme',
        ])
    }
    ,
    components: {
      countDown
    }
  }

</script>

<style lang="scss" scoped>
  @import '~@/design/scoped';

  a:hover, a:visited, a:link, a:active {
    text-decoration: none;
    color: inherit;
  }

  .clearFl:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0
  }

  .clearFl {
    zoom: 1
  }

  .popupVisibleOrder {
    width: 540px;
    text-align: center;
    background-color: #fff;
    .popup-tit {
      font-size: 34px;
      padding-top: 40px;
      font-family: PingFang-SC-Heavy;
      color: rgba(14, 48, 76, 1);
    }
    .popup-con {
      padding: 30px;
      font-size: 28px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(14, 48, 76, 1);
      line-height: 42px;
      border-bottom: 1px solid #CFD6DB;
      .popup-con-icon {
        font-size: 28px;
        padding-top: 30px;
        font-family: PingFang-SC-Medium;
        color: #3291EB;
        .checkboxUn {
          display: inline-block;
          width: 24px;
          height: 24px;
          @include bg-icon('checkboxUnPic.png', 24px);
        }
        .checkedbox {
          display: inline-block;
          width: 24px;
          height: 24px;
          @include bg-icon('checkboxPic.png', 24px);
        }
      }

    }
    .popBtn {
      height: 99px;
      line-height: 99px;
      font-size: 34px;
      font-family: PingFang-SC-Medium;
      div {
        width: 49%;
        float: left;
        color: #3291EB;
      }
      div:first-child {
        border-right: 1px solid #CFD6DB;
      }

    }
  }

  .popupVisibleQuery {
    width: 560px;
    .popup-tit {
      padding: 46px 76px;
      border-bottom: 1px solid #CFD6DB;
      font-size: 28px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(14, 48, 76, 1);
    }
    .popBtn {
      height: 100px;
      line-height: 100px;
      text-align: center;
      font-size: 34px;
      color: rgba(50, 145, 235, 1);
    }
  }

  .popupVisiblePay {
    width: 100%;
    .popup-item {
      width: 100%;
      height: 90px;
      line-height: 90px;
      font-size: 28px;
      text-align: center;
      font-family: PingFang-SC-Bold;
      font-weight: 600;
      background-color: #fff;
      color: #4A647A;
      border-bottom: 2px solid #EEF2F5;
    }
    .line-popup {
      width: 100%;
      height: 10px;
      background-color: rgba(0, 0, 0, .5);
    }
  }

  .popupVisiblePhone {
    width: 540px;
    text-align: center;
    background-color: #fff;
    .popup-tit {
      font-size: 34px;
      padding: 46px 0;
      font-family: PingFang-SC-Heavy;
      font-weight: 600;
      color: rgba(14, 48, 76, 1);
      line-height: 42px;
      border-bottom: 1px solid #CFD6DB;
    }
    .popup-con {
      padding: 30px;
      font-size: 28px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(14, 48, 76, 1);
      line-height: 42px;
      border-bottom: 1px solid #CFD6DB;
      .popup-con-icon {
        font-size: 28px;
        padding-top: 30px;
        font-family: PingFang-SC-Medium;
        color: #3291EB;
        .checkboxUn {
          display: inline-block;
          width: 24px;
          height: 24px;
          @include bg-icon('checkboxUnPic.png', 24px);
        }
        .checkedbox {
          display: inline-block;
          width: 24px;
          height: 24px;
          @include bg-icon('checkboxPic.png', 24px);
        }
      }

    }
    .popBtn {
      height: 99px;
      line-height: 99px;
      font-size: 34px;
      font-family: PingFang-SC-Medium;
      div {
        width: 49%;
        float: left;
        color: #3291EB;
      }
      div:first-child {
        border-right: 1px solid #CFD6DB;
      }

    }
  }

  .popupVisible {
    width: 100%;
    height: 450px;
    input {
      border: none;
      outline: none;
      background: none;
    }
    .popup-tit {
      border-bottom: 2px solid #CFD6DB;
      padding: 30px 30px 26px;
      .pop-tit {
        font-size: 32px;
        font-family: PingFang-SC-Heavy;
        font-weight: 600;
        color: #0E304C;
      }
      .cancel {
        font-size: 26px;
        font-family: PingFang-SC-Medium;
        font-weight: 500;
        color: #ADB7C1;
        float: right;
      }
    }
    .moneyPassword {
      font-size: 26px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(173, 183, 193, 1);
      margin-top: 60px;
      margin-left: 30px;
      margin-right: 30px;
      border-bottom: 2px solid #CFD6DB;
      .password {
        font-size: 26px;
        padding: 16px;
        width: 100%;
      }
    }
    .forgetPassword {
      font-size: 24px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(50, 145, 235, 1);
    }
    .popBtn {
      margin: 30px;
      text-align: right;
      .sureBtn {
        margin-top: 46px;
        height: 80px;
        font-size: 30px;
        font-family: PingFang-SC-Bold;
        letter-spacing: 10px;
        background-color: #3291EB;
      }
    }
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
    .goBack {
      position: absolute;
      top: 28px;
      left: 30px;
      width: 30px;
      height: 30px;
      @include bg-icon('goBack.png', 30px);
    }
    .cancel {
      position: absolute;
      right: 30px;
      font-size: 26px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(80, 86, 92, 1);
    }
  }

  .main {
    .news {
      padding: 50px 30px;
      /*box-shadow: 0 0 24px 0 rgba(13, 76, 135, 0.3);*/
      .total-con {
        float: left;
        width: 50%;
        .totalPrice {
          font-size: 50px;
          font-family: PingFang-SC-Heavy;
          font-weight: 800;
          color: rgba(50, 145, 235, 1);
        }
        .total-u {
          font-size: 26px;
          margin-top: 29px;
          font-family: PingFang-SC-Bold;
          font-weight: bold;
          color: rgba(80, 86, 92, 1);
        }
      }
      .con-r {
        font-size: 26px;
        font-family: PingFang-SC-Bold;
        font-weight: bold;
        color: #50565C;
        padding-top: 43px;
        .con-tit {
          margin-right: 16px;
        }
        p:last-child {
          margin-top: 19px;
        }
      }
    }
    .payment-mode {
      margin-top: 10px;
      position: relative;
      box-shadow: 3px 0 19px 0 rgba(13, 76, 135, 0.3);
      .p-img {
        display: inline-block;
        width: 38px;
        height: 38px;
        vertical-align: middle;
      }
      .p-b-img {
        @include bg-icon('bankCardPic.png', 38px);
      }
      .p-a-img {
        @include bg-icon('alipayPic.png', 38px);
      }
      .p-m {
        vertical-align: middle;
        font-size: 34px;
        margin-left: 20px;
        font-family: PingFang-SC-Bold;
        font-weight: 600;
        color: #50565C;
      }
      .p-a {
        font-size: 30px;
        position: absolute;
        right: 30px;
        top: 44px;
        @include bg-icon('arrowPic.png', 16px, 31px);
      }
      .p-tit {
        padding: 36px 30px;
        border: 1px solid #EEF2F5;
      }
      .p-tit-paid {
        padding: 36px 30px;
        border: 1px solid #EEF2F5;
        display: flex;
        div {
          flex: 1;
        }
        div:first-child {
          font-size: 34px;
          font-family: PingFang-SC-Bold;
          font-weight: 600;
          color: rgba(128, 135, 142, 1);
          text-align: left;
        }
        div:last-child {
          font-size: 34px;
          font-family: PingFang-SC-Bold;
          font-weight: 600;
          color: rgba(80, 86, 92, 1);
          text-align: right;
        }
      }
      .p-tit-icon {
        padding: 36px 30px;
        border: 1px solid #EEF2F5;
        display: flex;
        div {
          flex: 1;
        }
        div:first-child {
          font-size: 34px;
          font-family: PingFang-SC-Bold;
          font-weight: 600;
          color: rgba(128, 135, 142, 1);
          text-align: left;
        }
        div:last-child {
          font-size: 34px;
          font-family: PingFang-SC-Bold;
          font-weight: 600;
          color: rgba(80, 86, 92, 1);
          text-align: right;
        }
      }
      ul {
        padding: 0 30px 58px;
        li {
          padding-top: 35px;
          .p-c-tit {
            font-size: 30px;
            font-family: PingFang-SC-Bold;
            /*font-weight: 600;*/
            color: rgba(128, 135, 142, 1);
          }
          .query-icon {
            display: inline-block;
            width: 28px;
            height: 28px;
            @include bg-icon('queryIconPic.png', 26px);
            position: relative;
            top: 3px;
          }
          .p-c-c {
            font-size: 30px;
            font-family: PingFang-SC-Bold;
            font-weight: 600;
            color: rgba(14, 48, 76, 1);
            float: right;

            .copy {
              display: inline-block;
              width: 26px;
              height: 26px;
              @include bg-icon('copyPic.png', 26px);
              padding-left: 9px;
            }
          }

        }
      }
    }
    .icon {
      padding: 20px 30px;
      font-size: 24px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(245, 23, 77, 1);
      line-height: 36px;
    }
    .Countdown {
      display: inline-block;
      width: 530px;
      height: 70px;
      line-height: 70px;
      margin-top: 28px;
      background: rgba(50, 145, 235, 1);
      opacity: 0.5;
      border-radius: 35px;
      font-size: 28px;
      font-family: PingFang-SC-Bold;
      color: rgba(247, 249, 252, 1);
    }
    .btn {
      margin: 30px;
      /deep/ .mint-button {
        margin-top: 46px;
        height: 88px;
        font-size: 30px;
        font-family: PingFang-SC-Bold;
        letter-spacing: 3px;
        background-color: #3291EB;
      }
      .icon-btn {
        margin: 49px 0;
        font-size: 30px;
        text-align: center;
        font-family: PingFang-SC-Bold;
        font-weight: 600;
        color: #0E304C;
        a {
          color: #F28136;
        }
      }
    }
    .contact-con {
      margin: 30px;
      height: 88px;
      line-height: 88px;
      padding: 0 20px;
      border: 2px solid rgba(238, 242, 245, 1);
      font-size: 30px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(14, 48, 76, 1);
      .phoneNum {
        float: right;
        .phonePic {
          display: inline-block;
          width: 36px;
          height: 36px;
          @include bg-icon('phonePic.png', 36px);
          position: relative;
          top: 6px;
        }
        .arrowPic {
          display: inline-block;
          width: 16px;
          height: 31px;
          @include bg-icon('arrowPic.png', 16px, 31px);
          position: relative;
          top: 6px;
        }
      }
    }
    .icon-t {
      padding: 20px 30px 100px;
      font-size: 24px;
      font-family: PingFang-SC-Medium;
      color: rgba(173, 183, 193, 1);
      line-height: 36px;
      .icon-t-tit {
        font-size: 28px;
        margin-bottom: 30px;
        font-family: PingFang-SC-Heavy;
        font-weight: 800;
        color: #0E304C;
      }
    }

    .icon-t {
      padding: 20px 30px 100px;
      font-size: 24px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(173, 183, 193, 1);
      line-height: 36px;
      .icon-t-tit {
        font-size: 28px;
        margin-bottom: 30px;
        font-family: PingFang-SC-Heavy;
        font-weight: 800;
        color: #0E304C;
      }
    }
    .icon-n {
      font-size: 26px;
      font-family: PingFang-SC-Medium;
      color: rgba(128, 135, 142, 1);
      display: flex;
      padding: 30px;
      div:first-child {
        flex: 1;
        width: 60px;
        height: 60px;
        @include bg-icon('iconNotice.png', 60px);
      }
      div:last-child {
        flex: 4;
        margin-top: 16px;
      }
    }

    .icon-t-i-s {
      padding: 20px 30px 100px;
      font-size: 26px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: #80878E;
      .icon-t-tit {
        font-size: 30px;
        padding-bottom: 10px;
        color: #80878E;
        .t-s {
          font-size: 52px;
          font-family: PingFang-SC-Heavy;
          font-weight: 600;
          color: #3291EB;
        }
        .t-f {
          font-size: 52px;
          font-family: PingFang-SC-Heavy;
          font-weight: 600;
          color: #80878E;
        }
      }
      .i-t-c {
        p {
          margin-top: 16px;
        }

      }
    }
  }
</style>
