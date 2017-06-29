/*
  WiFi Web Server LED Blink

 A simple web server that lets you blink an LED via the web.
 This sketch will print the IP address of your WiFi Shield (once connected)
 to the Serial monitor. From there, you can open that address in a web browser
 to turn on and off the LED on pin 5.

 If the IP address of your shield is yourAddress:
 http://yourAddress/H turns the LED on
 http://yourAddress/L turns it off

 This example is written for a network using WPA encryption. For
 WEP or WPA, change the Wifi.begin() call accordingly.

 Circuit:
 * WiFi shield attached
 * LED attached to pin 5

 created for arduino 25 Nov 2012
 by Tom Igoe

ported for sparkfun esp32 
31.01.2017 by Jan Hendrik Berlin
 
 */

#include <WiFi.h>
#include <DHT.h>
#define DHTTYPE DHT22
#define DHTPIN  17

//const char* ssid     = "M&M Router";
//const char* password = "";
const char* ssid     = "WLAN-13DE64";
const char* password = "6146951670215168";
WiFiServer server(80);
DHT dht(DHTPIN, DHTTYPE, DHTPIN); // 11 works fine for ESP8266
 
float humidity, temp_f;  // Values read from sensor
char json[256];
unsigned long previousMillis = 0;        // will store last temp was read
const long interval = 1000;              // interval at which to read sensor
bool error = false;

void setup()
{
    Serial.begin(115200);

    // We start by connecting to a WiFi network

    Serial.println();
    Serial.println();
    Serial.print("Connecting to ");
    Serial.println(ssid);

    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }

    Serial.println("");
    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
    
    server.begin();

    dht.begin();           // initialize temperature sensor
}
 
void gettemperature() {
  unsigned long currentMillis = millis();
 
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;
    float _humidity = dht.readHumidity();
    float _temp_f = dht.readTemperature(false);
    error = isnan(_humidity) || isnan(_temp_f);
    if (!error) {
      humidity = _humidity;
      temp_f = _temp_f;
      Serial.println("DHT22 SUCCESS");
    } else {
      Serial.println("DHT22 ERROR");
    }
  }
}

void writeJson() {
  char txtTemp[16] = {0};
  char txtHum[16] = {0};
  dtostrf(temp_f, 3, 2, txtTemp);
  dtostrf(humidity, 3, 2, txtHum);
  sprintf(json, "{\"uptime\":%lu,\"error\":%i,\"temp\":%s,\"humidity\":%s}", millis(), (int)error, txtTemp, txtHum);
}


void loop(){
  gettemperature();
  WiFiClient client = server.available();   // listen for incoming clients
  if (client) {                             
    Serial.println("new client");           
    while (client.connected()) {            
      while (client.available()) 
        client.read();

      writeJson();
      Serial.println(json);
      client.print(json);
      break;
    }
    // close the connection:
    client.stop();
    Serial.println("client disonnected");
  }
}
