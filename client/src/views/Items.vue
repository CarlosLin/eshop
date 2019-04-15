<template lang="pug">
  .items
    | 預設時間
    el-row
      el-col(:span='6' :offset='9')
        datepicker(v-model='date')
    el-row
      el-col(:span='16' :offset='4')
        ul(v-for='(ele, index) in  promotions')
          li.activity  {{ele.type}}類促銷 ({{ele.discount*10}}折優惠) 時間{{ele.startDate | moment('dddd, MMM Do YYYY')}}~{{ele.endDate | moment('dddd, MMM Do YYYY')}}
    el-row(:gutter='20')
      el-col(:span='8' :offset='4')
        el-table(:data="items" :row-class-name='tableRowClassname')
          el-table-column(prop='type' label='種類')
          el-table-column(prop='name' label='名稱')
          el-table-column(prop='price' label='價錢')
          el-table-column(label='加入購物車')
            template(slot-scope='scope')
              i.el-icon-plus(@click='addToCart(scope.row); checkDiscount(promotions);')
      el-col(:span='6' :offset='3')
        el-table(:data='incart')
          el-table-column(prop='name' label='名稱')
          el-table-column(prop='quantity' label='數量')
          el-table-column(label='小計')
            template(slot-scope='scope')
              | {{scope.row.price * scope.row.quantity | rounding}}
        div(v-for='element in discount')
          p(v-show='element.price>0') {{element.discount*10}}折 {{element.type}}類折扣 共折抵 {{element.price | rounding}}元
        p.activity(v-show='couponUse') 使用折價卷 (滿1000折200)
        div 總計: {{countQuantity}}件   總價: {{countTotal | rounding}} 元
        el-col
          el-col(:span='20' :offset='1')
            form
              el-input(v-model='coupon' placeholder='輸入折價卷')
              el-button(type='success' icon='el-icon-check' circle @click='checkCoupon()')
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import datepicker from 'vue-date-pick'
import 'vue-date-pick/dist/vueDatePick.css'
import PromotionsService from '../../services/PromotionsService.js'
export default {
  name: 'items',
  data() {
    return{
      incart: [],
      discount: [],
      date: '2018-11-11',
      coupon: '',
      couponUse: false,
      couponDiscount: 0
    }
  },
  components: {
    datepicker
  },
  created () {
    this.getItemsApi()
    this.getPromotionsApi(this.date)
  },
  computed: {
    ...mapGetters({
      items: 'getItems',
      promotions: 'getPromotions'
    }),
    countQuantity: function() {
      var countQuantity = 0
      this.incart.forEach(ele => {
        countQuantity += parseInt(ele.quantity)
      })
      return countQuantity
    },
    countTotal: function () {
      var countTotal = 0.00
      var countCost = 0
      this.incart.forEach(ele => {
        countTotal += parseFloat(ele.quantity*ele.price)
      })
      this.discount.forEach(element => {
        countCost += element.price
      })
      if(this.couponUse === true && countTotal >= 1000) {
        this.couponDiscount = 200
      }
      return countTotal - countCost - this.couponDiscount
    }
  },
  methods: {
    ...mapActions([
      'getItemsApi',
      'getPromotionsApi'
    ]),
    addToCart: function(item) {
      var newCartItem = {};
      newCartItem.id = item.id
      newCartItem.name = item.name
      newCartItem.type = item.type
      newCartItem.price = item.price
      var newQuantity = 1
      this.incart.forEach(ele => {
        if(ele.id === item.id){
          newQuantity = parseInt(ele.quantity) +1
          var theOldOneIndex = this.incart.indexOf(ele)
          this.incart.splice(theOldOneIndex, 1)
        }
      })
      newCartItem.quantity = newQuantity
      this.incart.push(newCartItem)
    },
    checkDiscount: function(promotions) {
      this.discount = []
      promotions.forEach(element => {
        var countTotal = 0
        this.incart.forEach(e => {
          if(e.type === element.type){
            countTotal += e.price * e.quantity
          }
        });
        var result = countTotal * (1-element.discount)
        this.discount.push({
          type: element.type,
          discount: element.discount,
          price: result
        })
      });
    },
    tableRowClassname({rowIndex}) {
      if (rowIndex%2 === 1) {
        return 'success-row'
      } 
      return ''
    },
    checkCoupon () {
      console.log('Check Coupon',this.coupon, this.date)
      PromotionsService.checkCoupon({
        sn: this.coupon,
        date: this.date
      }).then((data) => {
        if (data.data.code === 1) {
          this.couponUse = true
        }
      })
    }
  },
  watch: {
    date () {
      this.getPromotionsApi(this.date)
    }
  },
  filters: {
    rounding (value) {
      return value.toFixed(2)
    }
  }
}
</script>
<style>
  .el-table .success-row {
    background-color: #f0f9eb;
  }
  .activity{
    color: red;
  }
</style>
