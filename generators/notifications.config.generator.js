const readlineSync = require('readline-sync')
const fs = require('fs')
const config = {}

const existingConfig = fs.existsSync(__dirname + "/../config/notifications.config.json");
if(existingConfig){
  if(!readlineSync.keyInYN("Istnieje już plik konfiguracyjny, czy chcesz go nadpisać?: ")) {
    process.exit(0);
  }
}
const PROVIDERS = ["Pushover", "Expo"];
let next = true, k = 0
while(next) {
  const deviceName = readlineSync.question("Podaj nazwe urzadzenia: ")
  config[deviceName] = {}
  config[deviceName].provider = PROVIDERS[readlineSync.keyInSelect(PROVIDERS, "Wybierz dostawcę powiadomień: ", {cancel: false})];
  console.log(config[deviceName].provider)
  if(config[deviceName].provider === "Pushover") {
    config[deviceName].tokenPushover = readlineSync.question("Podaj token z Pushover: ");
    config[deviceName].user = readlineSync.question("Podaj token uzytkownika z Pushover: ");
    config[deviceName].device = readlineSync.question("Podaj nazwe urzadzenia z Pushover: ");
  }
  else if(config[deviceName].provider === "Expo"){
    config[deviceName].tokenExpo = readlineSync.question("Podaj token urządzenia z aplikacji KiedySmieciApp: ");
  }
  k++;
  if (!readlineSync.keyInYN(`Chcesz podać kolejne(${k + 1}) urzadzenie?: `)) next = false;
}

fs.writeFileSync(__dirname + "/../config/notifications.config.json", JSON.stringify(config, null, 2))
console.log("Plik konfiguracyjny został zapisany!")