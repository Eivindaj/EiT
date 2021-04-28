#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
 
void setup() {
 
  Serial.begin(115200);                 //Serial connection
  WiFi.begin("Traalll", "tresprit");   //WiFi connection
 
  while (WiFi.status() != WL_CONNECTED) {  //Wait for the WiFI connection completion
 
    delay(500);
    Serial.println("Waiting for connection");
 
  }
 
}
 
void loop() {
 
  if (WiFi.status() == WL_CONNECTED) { //Check WiFi connection status
 
    HTTPClient http;    //Declare object of class HTTPClient
 
    http.begin("http://192.168.86.26:8885/loggs/");      //Specify request destination
    http.addHeader("Content-Type", "application/json");  //Specify content-type header

    

    float water =  0.93 * analogRead(A0) + 223.3; 
    Serial.println(water);  
    String jsonstring =  "{\"id\":\"603e7c631cd56e54c0033a04\",\"water\":\"";
    jsonstring += water; // bygger json objektet
    jsonstring += "\"}";
    Serial.println(jsonstring);
    int httpCode = http.POST(jsonstring);
    //int httpCode = http.POST("{\"id\":\"603e7c631cd56e54c0033a04\",\"water\":\+ water +\"}");   //Send the request
    String payload = http.getString();                  //Get the response payload
 
    Serial.println(httpCode);   //Print HTTP return code
    Serial.println(payload);    //Print request response payload
 
    http.end();  //Close connection
 
  } else {
 
    Serial.println("Error in WiFi connection");
 
  }
 
  delay(30000);  //Send a request every 30 seconds
 
}
