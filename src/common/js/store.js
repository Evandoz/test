/* 缓存 */
export function saveToLocal (id, key, value) {
  let seller = window.localStorage.__seller__
  if (!seller) { // 当前seller不存在
    seller = {}
    seller[id] = {}
  } else {
    seller = JSON.parse(seller)
    if (!seller[id]) { // 当前seller已存在，但不是之前的id
      seller[id] = {}
    }
  }
  seller[id][key] = value
  window.localStorage.__seller__ = JSON.stringify(seller)
}

/* 读取 */
export function loadFromLocal (id, key, def) { // def默认值
  let seller = window.localStorage.__seller__
  if (!seller) { // 没有seller，直接返回
    return def
  }
  seller = JSON.parse(seller)[id]
  if (!seller) { // 不是之前的seller
    return def
  }
  let ret = seller[key]
  return ret || def
}
