import Api from '../services/Api'

export default {
  fetchPromotion (date) {
    return Api().post('promotion', date)
  },
  checkCoupon (params) {
    return Api().post('checkCoupon', params)
  }
}
