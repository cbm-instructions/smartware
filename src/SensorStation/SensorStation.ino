/*
  Based on "WiFi Web Server LED Blink"-example 
*/

#include <WiFi.h>
#include <DHT.h>
#define DHTTYPE DHT22
#define DHTPIN  17

const char* ssid     = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";
WiFiServer server(80);
DHT dht(DHTPIN, DHTTYPE, DHTPIN);
 
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
 
  //Perform updates in fixed intervals
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;
    float _humidity = dht.readHumidity();
    float _temp_f = dht.readTemperature(false);
    error = isnan(_humidity) || isnan(_temp_f);
    if (!error) {
      //Save measures if they were read correctly
      humidity = _humidity;
      temp_f = _temp_f;
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
