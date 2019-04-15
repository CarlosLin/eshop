import PromotionsService from '../../../services/PromotionsService'
const types= {
  GETPROMOTION: 'promote/GETPROMOTION'
}

const state = {
  promotions: []
}

const getters = {
  getPromotions: state => state.promotions
}

const actions = {
  getPromotionsApi ({commit}, date) {
    console.log('Call Api Get Promote / ' + date)
    return new Promise(resolve => {
      setTimeout(() => {
        PromotionsService.fetchPromotion({
          date: date
        }).then((data) => {
          console.log(data.data)
          commit(types.GETPROMOTION, data.data)
          resolve()
        })
      }, 150)
    })
  }
}

const mutations = {
  [types.GETPROMOTION] (state, data) {
    state.promotions = data
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
