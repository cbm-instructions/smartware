# Smartware
"Challenge Based Making" an der Hochschule Mannheim im Sommersemester 2017. Betreut von Prof. Thomas Smits und Prof. Kirstin Kohler.
Die Projektarbeit dieses Kurses fand in zwei Pfasen statt: Dem Design Thinking und der Umsetzung.

## POV
_Wie können wir Stundenten helfen..._

## Lösungsansatz/Prototyp
`<Bild/>`

### Konzept
`<Text/>`

## (Bau-)Anleitung
### Laserschranke
Folgende Teile benötigt (Angaben in mm):
*   2 x OSB-Platte (800 x 150 x 10), als vertikale Halterung

*   2 x Holzplatte (350 x 150 x 30), aus möglichst schwerem Holz

*   2 x Dachlatte 360mm lang, als zusätzliche Befestigung
	Diese müssen an beiden Enden auf Gehrung gesägt werden, sodass diese als Diagonale, zwischen Bodenplatte und vertikaler OSB-Platte, verwendet werden können.

*   2 x Dachlatte 70mm lang, als Spiegelhalterung 
	Diese müssen an einem Ende auf Gehrung gesägt werden, sodass die Spiegel im 45 Grad Winkel angebracht werden können.

*   2 x Schminkspiegel

*   Diverse Holzschrauben

*   Optional: Lack in beliebiger Farbe

*   Optional: Zur besseren Befestigung des Lasers, sowie des Fototransistors können Winkel eingesetzt werden.

![Laserhalterung](/img/Laserhalterung)
![Spiegelhalterung](/img/Spiegelhalterung)

Die Halterungen werden wie auf den Bildern zu sehen, zusammengeschraubt und falls gewünscht mit dem Lack besprüht. An der rechten Halterung ist ein Metwallwinkel zu sehen. Dieser wurde an der Oberseite mit etwas Klebeband isoliert, damit er keinen Kurzschluss erzeugt. Darauf wird später der Laser montiert. An der anderen Halterung muss dann die Spiegelhalterung (Dachlatten 70mm lang) angeschraubt werden. In einigem Abstand darunter wird die zweite Spiegelhalterung montiert. Die Spiegel werden dann mit Heißkleber befestigt. 
Funktionsweise: Der Laser schießt das Licht auf den oberen Spiegel, welcher das Licht auf den unteren reflektiert und anschließend wieder zurück zur anderen Halterung. An der Stelle, wo der Laser wieder auftrifft wird dann der Fototransistor befestigt, sodass erkannt werden kann, ob der Lichtstrahl unterbrochen wurde.

Bitte beachten Sie:
Diese Halterungen waren nur für den Prototyp gedacht. Wenn das System dauerhaft installiert werden soll, ist eine feste Verankerung (bspw. im Türrahmen) sinnvoll.

#### Schranken
`<Bilder/Text/>`

#### Elektronik
![DoorLaser](/img/DoorLaser01.png)

##### Schaltplan
![Schaltplan DoorLaser](/img/DoorLaserBoard.png)
Bauteile:
* [ESP32](https://www.aliexpress.com/store/product/ESP32-Development-Board-WiFi-Bluetooth-Ultra-Low-Power-Consumption-Dual-Cores-ESP-32-ESP-32S/1983387_32799057508.html)
* 2x4.7k Ohm Widerstände
* [Phototransistor](https://www.conrad.de/de/fototransistor-5-mm-1100-nm-everlight-opto-pt331cpt333-3c-156408.html)
* [Laser](https://www.amazon.de/SunFounder-Transmitter-Sensor-Arduino-Raspberry/dp/B013QSHMSU/ref=sr_1_1?ie=UTF8&qid=1498743480&sr=8-1&keywords=sunfounder+laser)
* Reed-Schalter
* Externe Stromversorgung 5V, min. 500mA

Der Reed-Schalter wird in diesem Beispiel an Pin 17, der Phototransistor an Pin 33 angeschlossen - Diese Pinbelegung wird auch im Code verwendet!

##### Code
Der Source-Code für die Laserschranke befindet sich unter [/src/DoorLaser/](/src/DoorLaser/). Die WLAN-Funktionalität inkl. Webserver sind [arduino-esp32 - SimpleWiFiServer](https://github.com/espressif/arduino-esp32/blob/master/libraries/WiFi/examples/SimpleWiFiServer/SimpleWiFiServer.ino) entnommen.

Wir haben, um das Hauptprogramm einfach zu halten, Klassen erstellt, die uns erlauben, bequem [digitale](/src/DoorLaser/DigitalListener.h) und [analoge](/src/DoorLaser/AnalogListener.h) Pins zu überwachen und deren Auslösungen zu zählen.

**Achtung:** Der ESP32 verwendet 12Bit ADCs, was bedeutet, dass analoge 5V-Signale anstatt des auf Arduinos üblichen Wertebereiches von 0-255 auf 0-4095 gemappt werden. 

### Webkomponente
`<Bilder/Text/>`

#### Frontend

Hier befindet sich die Benutzeroberfläche, welche mit HTML und CSS realisiert wird.
Außerdem sind Bootstrap und die Material-Icons von Google im Einsatz.

#### Backend
##### Setup und Installation des Backend und Frontend auf dem Raspberry Pi 

###### Benötigte Teile: 
	Raspberry Pi 3
	Micro SD Karte
	Router mit Internetverbindung (Internet nur zur Konfiguration)
	USB-Maus, USB Tastatur, Netzadapter Micro-USB, HDMI-fähiger Monitor

###### Installieren sie Raspbian auf dem Raspberry Pi.
	Eine einfache Schritt für Schritt Anleitung ist hier zu finden: 
	https://www.raspberrypi.org/learning/noobs-install/
	
###### Verbinden sie den Raspberry mit dem Internet.

###### Installieren der benötigten Software.
	Führen sie folgende Befehle in der Konsole aus:
	sudo apt-get update
	sudo apt-get upgrade

	Folgende Befehle installieren einen Datenbank-Server:
	sudo apt-get install mysql-server
	sudo apt-get install mysql-client
	sudo service mysql start;
	
	Installieren von git:
	sudo apt-get install git
	
	Installieren von nodejs:
	In einem leeren Verzeichnis:
	sudo git clone https://github.com/creationix/nvm.git.nvm

	Bitte folgenden Code an das Ende dieser Datei hängen: ~/.bashrc
	(Öffnen mit: sudo nano ~/.bashrc)

	export NVM_DIR="$HOME/.nvm"
	[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
	In der Konsole node und npm installieren:
	nvm install node
	nvm install npm

	prüfe installation mit:
	node --version 
	npm --version

###### Anlegen der Datenbank
	Einloggen in den Datenbank-Server mit:
	mysql -u „adminname“ -p -h localhost
	Anschließend das bei der Installation vergebene Passwort eingeben.
	
	In der mysql konsole (angezeigt durch mysql> folgende Befehle eingeben:
	create Database cbm;
	use cbm;
	create table rooms(room_id int NOT NULL auto_increment,
	name varchar(20) NOT NULL ,PRIMARY KEY(room_id));
	
	create Table sensors(sensor_id int NOT NULL auto_increment, 
	name varchar(20) NOT NULL, type varchar(20) NOT NULL,
	url varchar(200) NOT NULL, room_id int  NOT NULL, PRIMARY KEY(sensor_id), 
	FOREIGN KEY(room_id) references rooms(room_id));
	
	create table sensorvalues(value_id int NOT NULL auto_increment, 
	sensor_id int NOT NULL, value int NOT NULL, timest timestamp ,
	PRIMARY KEY(value_id),FOREIGN KEY(sensor_id) references sensors(sensor_id));

	Räume und Sensoren in die Datenbank eintragen:
	In der mysql Konsole:
	insert into rooms(name) values(„name“);
	
	Eingabe für jeden Raum wiederholen.

	Die zugeordneten Ids können nun mit folgender Eingabe angezeigt werden:
	Select * from rooms;

	Anschließend Sensoren in DB eintragen:
	Insert into sensors(room_id,name,type,url) values(„raum_id“,“name“,“typ“,“url“);
	Id muss richtigem Raum zugeordnet sein.
	Name ist frei wählbar.
	Typ muss entweder „temp“, „vol“ oder „light“ sein.
	In url muss die URL-Adresse eingetragen werden unter der der Sensor erreichbar ist.

###### Herunterladen und starten des Servers
	In leerem Ordner:
	sudo git clone https://github.com/cbm-instructions/smartware.git
	
	Die Datei mymysql.js öffnen und Adminname und Passwort des Datenbank-Servers eintragen.
	sudo nano src/WebComponent/backend/mymysql.js	

	Installieren der Abhängigkeiten:
	Im Verzeichnis src/webComonent ausführen:
	npm install 
	
	Nun kann der Code gestartet werden: 
	node main.js

	Der Server sollte nun unter seiner IP-Adresse auf Port 3000 erreichbar sein.
	(anzeigbar durch den Befehl ifconfig)

### Messstation
`<Bild/>`

#### Schaltplan
![Schaltplan SensorStation](/img/SensorStationBoard.png)
Bauteile:
* [ESP32](https://www.aliexpress.com/store/product/ESP32-Development-Board-WiFi-Bluetooth-Ultra-Low-Power-Consumption-Dual-Cores-ESP-32-ESP-32S/1983387_32799057508.html)
* 4.7k Ohm Widerstand
* [DHT22](https://www.aliexpress.com/item/50PCS-LOT-DHT22-AM2302-Digital-Temperature-and-Humidity-Sensor-DHT22-Free-shiping/1699337492.html)
* Micro-USB Kabel direkt am ESP32 für Stromversorgung

Pin 1 des DHT22 wird mit VCC, Pin 4 mit Masse und Pin 3 gar nicht verbunden. Pin 2 wird mit einem digitalen IO-Pin und über einen 4.7k Ohm Widerstand mit VCC verbunden.

#### Code
Der Source-Code für die Messstation befindet sich unter [/src/SensorStation/](/src/SensorStation/). Die WLAN-Funktionalität inkl. Webserver sind [arduino-esp32 - SimpleWiFiServer](https://github.com/espressif/arduino-esp32/blob/master/libraries/WiFi/examples/SimpleWiFiServer/SimpleWiFiServer.ino) entnommen. Backend und Frontend Code befinden sich unter
(src/WebComponent)

Wir hatten im Verlauf des Projekts Probleme damit, den DHT22 stabil durch den ESP32 anzusteuern. Deswegen haben wir uns dazu entschieden, fehlerhafte Messwerte zu ignorieren und nur die aktuellsten ([korrekten](/src/SensorStation/SensorStation.ino#L58)) Messwerte an das Backend weiterzureichen. Unsere Tests haben ergeben, dass ungefähr 80% aller Messungen fehlerhaft sind - Das kompensieren wir durch häufige (sekündliche) Messungen.

## Fazit
`<Ausblick/>`
