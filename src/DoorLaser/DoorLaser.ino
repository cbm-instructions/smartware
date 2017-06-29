/*
  Based on "WiFi Web Server LED Blink"-example 
*/

#include <WiFi.h>
#include "AnalogListener.h"
#include "DigitalListener.h"

#define PIN_DOOR 17
#define PIN_LASER 33
#define LASER_MIN 1024 //anstatt 300: ESP32 hat 12bit ADC!
#define LASER_MAX 4095 //anstatt 1024: ESP32 hat 12bit ADC

const char* ssid     = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";

WiFiServer server(80);
AnalogListener laser(PIN_LASER, LASER_MIN, LASER_MAX);
DigitalListener door(PIN_DOOR, LOW);
char json[256];

void setup() {
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
}

void writeJson() {
  sprintf(json, "{\"uptime\":%lu,\"laser\":%i,\"door\":%i}", millis(), laser.GetCountTriggered(), door.GetCountTriggered());
}

void loop() {  
  laser.Update();
  door.Update();

  WiFiClient client = server.available();   // listen for incoming clients
  if (client) {                             
    Serial.println("new client");           
    while (client.connected()) {            
      while (client.available()) 
        client.read();

      writeJson();
      laser.Reset();
      door.Reset();
      Serial.println(json);
      client.print(json);
      break;
    }
    // close the connection:
    client.stop();
    Serial.println("client disonnected");
  }
  
}



