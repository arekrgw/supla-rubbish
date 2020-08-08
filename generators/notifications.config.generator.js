const readlineSync = require('readline-sync')
const fs = require('fs')
const config = {}

const existingConfig = fs.existsSync(__dirname + "/../config/notifications.config.json");
if(existingConfig){
  if(!readlineSync.keyInYN("Istnieje już plik konfiguracyjny, czy chcesz go nadpisać?: ")) {
    process.exit(0);
  }
}
let next = true, k = 0
while(next) {
  const deviceName = readlineSync.question("Podaj nazwe urzadzenia: ")
  config[deviceName] = {}
  config[deviceName].token = readlineSync.question("Podaj token urządzenia z aplikacji KiedySmieciApp: ");
  k++;
  if (!readlineSync.keyInYN(`Chcesz podać kolejny(${k + 1}) region?: `)) next = false;
}

fs.writeFileSync(__dirname + "/../config/notifications.config.json", JSON.stringify(config, null, 2))
console.log("Plik konfiguracyjny został zapisany!")