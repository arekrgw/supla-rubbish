# SUPLA-Rubbish v2.0.0

Skrypt podmieniający w chmurze SUPLI nazwę kanału oraz ikonę, na odpowiednią datę oraz typ najbliszych wywozonych śmieci

# INSTALACJA

```shell
1. git clone https://github.com/arekrgw/supla-rubbish.git
2. cd supla-rubbish
3. npm install
4. npm run gen:supla
5. npm run gen:icons
```
Aby odpalić skrypt wystarczy wpisać: `npm start` lub `node index.js`

# AKTUALIZACJA v2.0.0

W aktualizacji do 2.0.0 zmieniła się struktura pliku konfiguracyjnego `supla.config.json`. Od teraz mozna dodać wiele regionów do jednego skryptu i mozna edytować kanały z róznych kont chmury SUPLA.

***PRZED UPDATEM DO NOWEJ WERSJI, SKOPIUJ SWOJE PLIKI KONFIGURACYJNE!***

### KROKI DO AKTUALIZACJI DO v2.0.0
```
1. cd supla-rubbish
2. git pull origin master --force
3. npm install
4. npm run gen:supla
5. npm run gen:icons
```

# AKTUALIZACJA v3.0.0

W aktualizacji 3.0.0 zostały dodane powiadomienia push konfigurowane w `supla.config.json` oraz `notifications.config.json`, aby powiadomienia działały potrzebna jest ta aplikacja na androida https://drive.google.com/drive/folders/1JqT-_GsBy62Pi8UqLYqrHV7Y1xCAhKbZ?usp=sharing z niej uzyskamy token potrzebny w konfiguracji powiadomień. Nie potrzeba juz parametru `functionId`. Naprawiono błąd, ze po zmianie lokalizacji kanału po aktualizacji kanału wracał do pierwotnej.

**Od wersji 3.0.0 node.js musi być w wersji conajmniej 12**

Jezeli dla twojego urządzenia nie ma oficalnego buildu to na tej stronie znajdują się nieoficjalne: https://unofficial-builds.nodejs.org/download/release/

***PRZED UPDATEM DO NOWEJ WERSJI, SKOPIUJ SWOJE PLIKI KONFIGURACYJNE!***

### KROKI DO AKTUALIZACJI DO v3.0.0
```
1. cd supla-rubbish
2. git pull --rebase origin master
3. npm install
4. npm run gen:notif // opcjonalne
5. npm run gen:supla
6. npm run gen:icons
```

Aby powiadomienia działały potrzebny jest zainstalowany program `at` oraz `curl`, który mozna zainstalować poleceniem:
```
sudo apt install at
sudo apt install curl
```

Na forum SUPLA.org jest wątek poświęcony temu skryptowi oraz serwerowi KiedyŚmieciv2 https://forum.supla.org/viewtopic.php?f=11&t=6861