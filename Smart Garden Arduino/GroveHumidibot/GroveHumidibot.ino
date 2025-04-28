//sensor of both temperature and humidity (DHT11)
//Code has been copied from the test library for the moment. https://wiki.seeedstudio.com/Grove-TemperatureAndHumidity_Sensor/
//Update 1: converted all debug to Serial


// Example testing sketch for various DHT humidity/temperature sensors
// Written by ladyada, public domain

#include "Grove_Temperature_And_Humidity_Sensor.h"

// Using DHT 11
#define DHTTYPE DHT11

//DHT 11 is one of the DHT numbers that requires a pin instead of an I2C. -AlexP
//Redefined to D3 pin (from D2) in order to avoid conflict with the One Wire Temperature Sensor - AlexP
#define DHTPIN 3     // what pin we're connected to（DHT10 and DHT20 don't need define it）
DHT dht(DHTPIN, DHTTYPE);   //   DHT11 DHT21 DHT22

// Connect pin 1 (on the left) of the sensor to +5V
// Connect pin 2 of the sensor to whatever your DHTPIN is
// Connect pin 4 (on the right) of the sensor to GROUND
// Connect a 10K resistor from pin 2 (data) to pin 1 (power) of the sensor

void setup() {

    Serial.begin(9600);
    Serial.println("DHTxx test!");
    Wire.begin();

    /*if using WIO link,must pull up the power pin.*/
    // pinMode(PIN_GROVE_POWER, OUTPUT);
    // digitalWrite(PIN_GROVE_POWER, 1);

    dht.begin();
}

void loop() {
    float temp_hum_val[2] = {0};
    // Reading temperature or humidity takes about 250 milliseconds!
    // Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)
    // readTempAndHumidity writes the humidity and temperature into a 2-element array (I think) 
    // Temperature: done in degrees Celsius
    // Humidity: written as an RH percentage (moisture content of the air over the maximum moisture content the air could have given its temperature) - AlexP
    if (!dht.readTempAndHumidity(temp_hum_val)) {
        Serial.print("Humidity: ");
        Serial.print(temp_hum_val[0]);
        Serial.print("      ");
        Serial.print("Temperature: ");
        Serial.print(temp_hum_val[1]);
        Serial.println(" *C");
    } else {
        Serial.println("Failed to get temprature and humidity value.");
    }

    delay(1500);
}
