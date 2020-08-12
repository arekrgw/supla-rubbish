const readlineSync = require('readline-sync')
const fs = require('fs')
const config = {
  "kiedySmieciURL": "https://kiedysmieciv2.herokuapp.com",
  "regions": []
}

const existingConfig = fs.existsSync(__dirname + "/../config/supla.config.json");
if(existingConfig){
  if(!readlineSync.keyInYN("Istnieje już plik konfiguracyjny, czy chcesz go nadpisać?: ")) {
    process.exit(0);
  }
}

console.log("supla.config.json generator rozpoczął pracę\nJeżeli wartość w nawiasach jest dla ciebie okej to wciśnij ENTER\n\n")

const kiedySmieciURL = readlineSync.question("KiedyŚmieciURL(https://kiedysmieciv2.herokuapp.com): ")
if (kiedySmieciURL) config.kiedySmieciURL = kiedySmieciURL;

if (readlineSync.keyInYN("Chcesz teraz zacząć wprowadzać regiony?: ")) {
  let next = true, i = 0;
  while (next) {
    const tempRegion = {
      "bearer": null,
      "suplaBaseServerURL": null,
      "region": null,
      "channel": null,
      "prefix": null,
      "printTypes": false
    }
    tempRegion.bearer = readlineSync.question("Podaj Authorization Bearer z zakładki Integracje na swojej chmurze SUPLA: ")
    tempRegion.suplaBaseServerURL = readlineSync.question("Podaj API URL chmury SUPLA np. https://svr16.supla.org/api/v2.3.0: ")
    tempRegion.region = readlineSync.question("Podaj ID regionu z serwera KiedyŚmieci. Wszystkie regiony możesz znaleźć na https://kiedysmieciv2.herokuapp.com/regions: ")
    tempRegion.channel = readlineSync.question("Podaj ID kanału którym chcesz sterować: ")
    tempRegion.prefix = readlineSync.question("Podaj prefix kanału, czyli prefix przed datą: ")
    tempRegion.printTypes = readlineSync.keyInYN(`Czy chcesz aby wyświetlać rodzaje śmieci za datą?: `)
    if (readlineSync.keyInYN(`Czy chcesz podać konfiguracje powiadomien PUSH?: `)) {
      tempRegion.notifications = {}
      tempRegion.notifications.devices = []
      let next = true, k = 0;
      while(next) {
        const tempDevice = {};
        tempDevice.name = readlineSync.question("Podaj nazwę urzadzenia zgodna z plikiem notifications.config.json: ");
        tempDevice.days = readlineSync.question("Podaj ile dni przed wywozem ma się wysłać powiadomienie: ")
        tempDevice.when = readlineSync.question("Podaj godzinę o której ma się wysłać powiadomienie [HH:MM]: ")
        tempRegion.notifications.devices.push(tempDevice)
        k++;
        next = readlineSync.keyInYN(`Czy chcesz podać kolejne(${k+1}) powiadomienie?: `)
      }
    }

    config.regions.push(tempRegion);
    console.log(`Region ${i + 1} utworzony!`)

    i++;
    if (!readlineSync.keyInYN(`Chcesz podać kolejny(${i + 1}) region?: `)) next = false;

  }
}

fs.writeFileSync(__dirname + "/../config/supla.config.json", JSON.stringify(config, null, 2))
console.log("Plik konfiguracyjny został zapisany!")
