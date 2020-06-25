const axios = require("axios");
const fs = require("fs");
const {suplaConfigValidation, iconsConfigValidation} = require(__dirname + '/validation')

//getting all config files
let icons, config;
try {
  const rawIcons = fs.readFileSync(__dirname + "/icons.config.json");
  icons = JSON.parse(rawIcons);
  const rawConfig = fs.readFileSync(__dirname + "/supla.config.json");
  config = JSON.parse(rawConfig);
} catch (err) {
  console.error(
    "Error reading configuration files, missing",
    err.path
  );
  process.exit(3);
}

if(!suplaConfigValidation(config)) {
  console.error("There is an error in supla.config.json configuration file")
  process.exit(10)
}
if (!iconsConfigValidation(icons)) {
  console.error("There is an error in icons.config.json configuration file");
  process.exit(11);
}


(async () => {
  //getting all dates from region
  try {
    const dates = await axios.get(
      `${config.kiedySmieciURL}/dates/${config.region}`
    );
    
    let typesArr = new Set([]);
    //sortowanie dat rosnąco
    const datesSorted = dates.data.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    //wyszukiwanie najblższego wywozu
    const nearestDate = datesSorted.find(
      (el) => new Date(el.date).getTime() > new Date().getTime()
    );
    if (!nearestDate) {
      console.error(
        "Couldn't find next date\nPossibly update calendar on the KiedyŚmieciAPI"
      );
      process.exit(5);
    }
    typesArr.add(nearestDate.garbageType.type);
    const date = nearestDate.date;

    //wyszukiwanie takich samych dat(wiele typów smieci na raz)
    datesSorted.map((el) => {
      if (el.date == date) typesArr.add(el.garbageType.type);
    });
    //sortowanie typów
    typesArr = [...typesArr];
    typesArr.sort();
    //liczeneie ile dni zostało do wywozu
    const howManyDays = Math.round(
      (new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    //szukanie odpowiedniej ikony z pliku konfiguracyjnego
    let { icon } = icons.find((el) => {
      if (el.types.length != typesArr.length) return false;
      el.types.sort();
      for (let a = 0; a < el.types.length; a++) {
        if (el.types[a] !== typesArr[a]) {
          return false;
        }
      }
      return true;
    });
    //jeżeli nie zostala znaleziona to na kanale zostanie ustawiona domyslna ikona
    if (!icon) {
      icon = null;
    }
    //generowanie nazwy kanalu czyli daty 
    const dateString = `${new Date(date)
      .getDate()
      .toString()
      .padStart(2, "0")}.${(new Date(date).getMonth() + 1)
      .toString()
      .padStart(2, "0")}.${new Date(date).getFullYear()}(${
      howManyDays < 2
        ? howManyDays == 0
          ? `dziś`
          : `${howManyDays} dzień`
        : `${howManyDays} dni`
    })`;
    //place for future push notifications
    //request to supla
    const response = await axios.put(
      `${config.suplaBaseServerURL}/channels/${config.channel}`,
      {
        caption: dateString,
        functionId: config.functionId,
        userIconId: icon,
      },
      {
        headers: {
          Authorization: `Bearer ${config.bearer}`,
          "Content-Type": "application/json",
          accept: "application/json",
        },
      }
    );
    //supla updated successfully
    console.log(
      "Check success, new date has been set to",
      dateString,
      "and the type/s of garbage is",
      typesArr
    );
  } catch (err) {
    console.error("Error occured", err);
    process.exit(4);
  }
})();
