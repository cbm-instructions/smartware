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

![Laserhalterung](/img/Laserhalterung.png)
![Spiegelhalterung](/img/Spiegelhalterung.png)

Die Halterungen werden wie auf den Bildern zu sehen, zusammengeschraubt und falls gewünscht mit dem Lack besprüht. An der rechten Halterung ist ein Metwallwinkel zu sehen. Dieser wurde an der Oberseite mit etwas Klebeband isoliert, damit er keinen Kurzschluss erzeugt. Darauf wird später der Laser montiert. An der anderen Halterung muss dann die Spiegelhalterung (Dachlatten 70mm lang) angeschraubt werden. In einigem Abstand darunter wird die zweite Spiegelhalterung montiert. Die Spiegel werden dann mit Heißkleber befestigt. 
Funktionsweise: Der Laser schießt das Licht auf den oberen Spiegel, welcher das Licht auf den unteren reflektiert und anschließend wieder zurück zur anderen Halterung. An der Stelle, wo der Laser wieder auftrifft wird dann der Fototransistor befestigt, sodass erkannt werden kann, ob der Lichtstrahl unterbrochen wurde.

Bitte beachten Sie:
Diese Halterungen waren nur für den Prototyp gedacht. Wenn das System dauerhaft installiert werden soll, ist eine feste Verankerung (bspw. im Türrahmen) sinnvoll.

#### Schranken
`<Bilder/Text/>`

#### Elektronik
`<Bild/>`

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
`<Bilder/Text/>`

### Messstation
![Messstation](/src/SensorStation01.png)

#### Schaltplan
![Schaltplan SensorStation](/img/SensorStationBoard.png)
Bauteile:
* [ESP32](https://www.aliexpress.com/store/product/ESP32-Development-Board-WiFi-Bluetooth-Ultra-Low-Power-Consumption-Dual-Cores-ESP-32-ESP-32S/1983387_32799057508.html)
* 4.7k Ohm Widerstand
* [DHT22](https://www.aliexpress.com/item/50PCS-LOT-DHT22-AM2302-Digital-Temperature-and-Humidity-Sensor-DHT22-Free-shiping/1699337492.html)
* Micro-USB Kabel direkt am ESP32 für Stromversorgung

Pin 1 des DHT22 wird mit VCC, Pin 4 mit Masse und Pin 3 gar nicht verbunden. Pin 2 wird mit einem digitalen IO-Pin und über einen 4.7k Ohm Widerstand mit VCC verbunden.

#### Code
Der Source-Code für die Messstation befindet sich unter [/src/SensorStation/](/src/SensorStation/). Die WLAN-Funktionalität inkl. Webserver sind [arduino-esp32 - SimpleWiFiServer](https://github.com/espressif/arduino-esp32/blob/master/libraries/WiFi/examples/SimpleWiFiServer/SimpleWiFiServer.ino) entnommen.

Wir hatten im Verlauf des Projekts Probleme damit, den DHT22 stabil durch den ESP32 anzusteuern. Deswegen haben wir uns dazu entschieden, fehlerhafte Messwerte zu ignorieren und nur die aktuellsten ([korrekten](/src/SensorStation/SensorStation.ino#L58)) Messwerte an das Backend weiterzureichen. Unsere Tests haben ergeben, dass ungefähr 80% aller Messungen fehlerhaft sind - Das kompensieren wir durch häufige (sekündliche) Messungen.

## Fazit
`<Ausblick/>`