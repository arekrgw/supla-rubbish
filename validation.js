const suplaConfigValidation = (obj) => {
  if(typeof obj !== 'object' || obj === null) return false
  const mainKeys = ['kiedySmieciURL', 'regions'];
  const regionKeys = ['bearer', 'suplaBaseServerURL', 'prefix', 'functionId', 'region', 'channel'];
  let truthy = true;
  mainKeys.forEach((key) => {
    if(!obj.hasOwnProperty(key)) truthy = false;
  })
  if(!truthy) return false;
  if(!Array.isArray(obj.regions)) return false;
  console.log("regions")

  let f = true;
  obj.regions.forEach(region => {
    regionKeys.forEach(key => {
      if(!region.hasOwnProperty(key)) f = false;
    })
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