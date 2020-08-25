const axios = require("axios");
const fs = require("fs");
const { suplaConfigValidation, iconsConfigValidation } = require(__dirname + '/validation')
const { prettifyTypes } = require('./utilities/utils')
const NotificationsService = require('./services/NotificationsService')

//getting all config files
let icons, config;
try {
  const rawIcons = fs.readFileSync(__dirname + "/config/icons.config.json");
  icons = JSON.parse(rawIcons);
  const rawConfig = fs.readFileSync(__dirname + "/config/supla.config.json");
  config = JSON.parse(rawConfig);
} catch (err) {
  console.error(
    "Error reading configuration files, missing",
    err.path
  );
  process.exit(3);
}
let res;
if ((res = suplaConfigValidation.validate(config).error)) {
  console.error("There is an error in supla.config.json configuration file,", res.details[0].message)
  process.exit(10)
}

if ((res = iconsConfigValidation.validate(icons).error)) {
  console.error("There is an error in icons.config.json configuration file,", res.details[0].message);
  process.exit(11);
}
console.log("Notif valid", NotificationsService.isConfigured);
// process.exit(0)

(async () => {
  for (const region of config.regions) {
    try {
      //getting all dates from region
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
      const dateString = `${region.prefix ? region.prefix + ": " : ""}${new Date(date)
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
      // Creating messages for push notification service
      if(region.notifications && NotificationsService.isConfigured){
        region.notifications.devices.map((device) => {
          if(device.days == howManyDays){
            //set notification
            NotificationsService.createNotification(device, dateString, region.prefix || "");
          }
        })
      }
      // request to supla
      const {data: channelInfo} = await axios.get(`${region.suplaBaseServerURL}/channels/${region.channel}`, {
        headers: {
          Authorization: `Bearer ${region.bearer}`,
          accept: "application/json",
        },
      })
      const response = await axios.put(
        `${region.suplaBaseServerURL}/channels/${region.channel}`,
        {
          caption: dateString,
          functionId: channelInfo.functionId,
          userIconId: icon,
          locationId: channelInfo.locationId
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
  NotificationsService.setPushNotifications();
})();
