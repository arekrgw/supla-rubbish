const axios = require("axios");
const fs = require("fs");
const {suplaConfigValidation, iconsConfigValidation} = require(__dirname + '/validation')
const {prettifyTypes} = require('./utilities/utils')

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

if (!suplaConfigValidation(config)) {
  console.error("There is an error in supla.config.json configuration file")
  process.exit(10)
}
if (!iconsConfigValidation(icons)) {
  console.error("There is an error in icons.config.json configuration file");
  process.exit(11);
}

(async () => {
  //getting all dates from region
  for (const region of config.regions) {
    try {
      const dates = await axios.get(
        `${config.kiedySmieciURL}/dates/${region.region}`
      );
      let typesArr = new Set([]);
      //sortowanie dat rosnąco
      const datesSorted = dates.data.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      //wyszukiwanie najblższego wywozu
      let todayMidnight = new Date(new Date().setHours(0, 0, 0, 0));
      const nearestDate = datesSorted.find(
        (el) => new Date(el.date) >= todayMidnight
      );
      if (!nearestDate) {
        console.error(
          "Couldn't find next date\nPossibly update calendar on the KiedyŚmieciAPI"
        );
        continue;
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
      const howManyDays = Math.floor(
        (new Date(date) - todayMidnight) / (1000 * 60 * 60 * 24)
      );

      //szukanie odpowiedniej ikony z pliku konfiguracyjnego
      let icon;
      let iconObj = icons.find((el) => {
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
      if (!iconObj) {
        icon = null;
      } else icon = iconObj.icon
      //generowanie nazwy kanalu czyli daty
      const dateString = `${region.prefix}: ${new Date(date)
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
      })${region.printTypes ? ' ' + prettifyTypes(typesArr) : ''}`;
      // place for future push notifications
      // request to supla
      const response = await axios.put(
        `${region.suplaBaseServerURL}/channels/${region.channel}`,
        {
          caption: dateString,
          functionId: region.functionId,
          userIconId: icon,
        },
        {
          headers: {
            Authorization: `Bearer ${region.bearer}`,
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
      console.error("Error occured in one of a region", err);
    }
  }
})();
