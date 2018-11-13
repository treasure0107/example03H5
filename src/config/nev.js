let baseUrl = '';
let imgBaseUrl = '';
let routerMode = 'hash';

if (process.env.NODE_ENV === 'development') {
  baseUrl = 'https://testapi.appleusdt.com/api/'
  imgBaseUrl = 'https://api.appleusdt.com'
} else if (process.env.NODE_ENV === 'production') {
  baseUrl = 'https://api.appleusdt.com/api/'
  // baseUrl = 'https://testapi.appleusdt.com/api/'
  imgBaseUrl = 'https://api.appleusdt.com'
}

export {
  baseUrl,
  routerMode,
  imgBaseUrl
}
