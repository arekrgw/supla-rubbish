const suplaConfigValidation = (obj) => {
  if(typeof obj !== 'object' || obj === null) return false
  const keys = ['bearer', 'suplaBaseServerURL', 'kiedySmieciURL', 'functionId', 'region', 'channel'];
  let f = true;
  keys.forEach((el) => {
    if(!obj.hasOwnProperty(el)) {
      f = false
    }
  })
  return f
}

const iconsConfigValidation = (config) => {
  if(!Array.isArray(config)) return false;
  if(config.length == 0) return false;
  const keys = ['icon', 'types']
  let f = true
  config.forEach(el=>{
    keys.forEach(k => {
      if(!el.hasOwnProperty(k)) {
        f = false
      }
    })
    if(f) {
      if(!Array.isArray(el.types)){
        f = false
      }
    }
  })
  return f;
}

module.exports = {
  iconsConfigValidation,
  suplaConfigValidation
}