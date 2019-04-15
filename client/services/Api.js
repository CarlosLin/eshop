import axios from 'axios'

export default() => {
  return axios.create({
    baseURL: `https://6bc1722a.ngrok.io`
  })
}
