// import router from '@/router'
import ItemsService from '../../../services/ItemsService'
const types = {
  GETITEMS: 'item/GETITEMS',
  ADDCART: 'item/ADDCART'
}

const state = {
  items: [],
}

const getters = {
  getItems: state => state.items,
}

const actions = {
  getItemsApi ({commit, res}) {
    console.log('Call get Items API')
    res = ItemsService.fetchItems()
    res.then((data) => {
      console.log(data)
      commit(types.GETITEMS, data.data)
    })
  }
}

const mutations = {
  [types.GETITEMS] (state, data) {
    state.items = data
  }
}

export default { 
  state,
  getters,
  actions,
  mutations
}
