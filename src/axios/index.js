import axios from 'axios'
import { baseUrl } from '@/config/nev' // url
import store from '@/store/modules/pairs'

/** package.json文件的version参数 */
import packageJSON from '../../package.json'
let version = packageJSON.version

axios.defaults.baseURL = baseUrl;
axios.interceptors.request.use(config => {
    config.headers.common["Version"] = version
    store.state.loadingStatus = true
    if (localStorage.getItem('token')) {
        config.headers.common["Authorization"] = "bearer " + localStorage.getItem('token');
    }
    return config
})
axios.interceptors.response.use(data => {
    store.state.loadingStatus = false
    if (data.status == 200) {
        return data.data
    }
}), err => {
    store.state.loadingStatus = false
    return Promise.reject(err)
}

export default axios
