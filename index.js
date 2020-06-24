const axios = require('axios')
const fs = require('fs');

let icons, config;
try {
  const rawIcons = fs.readFileSync('icons.config.json');
  icons = JSON.parse(rawIcons);
  const rawConfig = fs.readFileSync('supla.config.json');
  config = JSON.parse(rawConfig);
}
catch(err){
  console.error("Error reading configuration files")
  process.exit(3);
}

(async () => {
  try {
    const dates = await axios.get(`${config.kiedySmieciURL}/dates/${config.region}`)
    let typesArr = new Set([])
    const datesSorted = dates.data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    const nearestDate = datesSorted.find((el) => new Date(el.date).getTime() > new Date().getTime())
    if(!nearestDate) {
      console.log("Couldn't find next date\nPossibly update calendar")
      process.exit(5)
    }
    typesArr.add(nearestDate.garbageType.type);
    const date = nearestDate.date;
    //finding possible same date in arr
    datesSorted.map((el) => {
      if(el.date == date) typesArr.add(el.garbageType.type);
    })
    typesArr = [...typesArr]
    const howManyDays = Math.round((new Date(date).getTime() - new Date().getTime()) / (1000*60*60*24))
    const {icon} = icons.find((el) => {
      if(el.types.length != typesArr.length) return false;
      for(let a = 0; a<el.types.length; a++){
        if(el.types[a] !== typesArr[a]) {
          return false
        }
      }
      return true
    })
    const dateString = `${new Date(date).getDate().toString().padStart(2, '0')}.${
      (new Date(date).getMonth() + 1).toString().padStart(2, '0')
    }.${new Date(date).getFullYear()}(${
      howManyDays < 2 ? `${howManyDays} dzień` : `${howManyDays} dni`
    })`;

    //request to supla
    const response = await axios.put(`${config.suplaBaseServerURL}/channels/${config.channel}`, {
      "caption": dateString,
      "functionId": config.functionId,
      "userIconId": icon
    },{
      headers: {
        'Authorization': `Bearer ${config.bearer}`,
        'Content-Type': 'application/json',
        'accept': 'application/json'
      }
    })

    console.log("Check success")
  }
  catch(err){
    console.error("Error occured", err)
    process.exit(4);
  }

  // console.log(dates);
})()



