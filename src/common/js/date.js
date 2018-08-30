export function formatDate (date, fmt) {
  if (/(y+)/.test(fmt)) { // 用正则表达式去匹配fmt
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length)) // 截取年分
  }
  let o = {
    'M+': date.getMonth() + 1, // 从0开始
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str)) // 左位补0
    }
  }
  return fmt
}

function padLeftZero (str) {
  return ('00' + str).substr(str.length) // 先用00与str拼接，然后根据str长度进行截取
}
