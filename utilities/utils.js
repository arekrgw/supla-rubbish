const prettifyTypes = (types) => {
  let str = ''
  for (let i = 0; i < types.length; i++) {
    str += types[i];
    if (i !== types.length - 1) str += ", "
  }
  return str
}

module.exports = {
  prettifyTypes
}