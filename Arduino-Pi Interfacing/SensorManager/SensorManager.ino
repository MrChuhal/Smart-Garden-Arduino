#include "Grove_Temperature_And_Humidity_Sensor.h"
#include <Wire.h>
#include "Arduino.h"
#include "Si115X.h"
#include <OneWire.h>
#include <DallasTemperature.h>

//Setup
//Grove Moisture and Humidity Sensor - D3
//Grove Capacitative Moisture Sensor - A0
//Grove Sunlight Sensor - IC2
//Grove One-Wire Temperature Sensor - D2
//Grove Relay - D5
//Button Switch - D6

// From demo code: Setup a oneWire instance to communicate with any OneWire devices (not just Maxim/Dallas temperature ICs)
//One Wire Temperature Sensor is connected to D2
#define ONE_WIRE_BUS 2
OneWire oneWire(ONE_WIRE_BUS);
// From demo code: Pass our oneWire reference to Dallas Temperature. 
DallasTemperature sensors(&oneWire);

// Using DHT 11
#define DHTTYPE DHT11
#define DHTPIN 3 //configured to pin 3
DHT dht(DHTPIN, DHTTYPE);

//Sunlight sensor interface
Si115X Si1151 = Si115X();

//Constants
#define DELAYTIME 3000 // number of milliseconds delay in each reading
#define BUTTON1 6; //button1 pin
#define BUTTON2 7; //button2 pin

bool state1 = 1; //set button1 state
bool state2 = 1; //set button2 state
bool on = 0; // should by default be off
bool hold = 0;
bool hold2 = 0; //variable for verifying if button two is being held
int recevied = 0; //value received from the Raspberry PI
float temp_hum_val[2] = {0};
void setup() {
  //relay setup
  pinMode(5,OUTPUT);

  //set up dual button switch
  pinMode(BUTTON1,INPUT);
  pinMode(BUTTON2,INPUT);
  
  Serial.begin(9600);
  
  Wire.begin();  
  //set up sunlight sensor
  Serial.println("Beginning Si1151!");
  while (!Si1151.Begin()) {
      Serial.println("Si1151 is not ready!");
      delay(1000);
  }
  Serial.println("Si1151 is ready!");

  //NOTE: refer back to Grove DHT demo if using WIO
  dht.begin();
  //Start up the One Wire Temperature Sensor library
  sensors.begin();
  
}

void loop() {
  if(Serial.available() > 0) {
    received = Serial.read();
    if(received == 1) {
      turnOnWaterPump();
    } else if(received == 2) {
      turnOffWaterPump();
    } else if(received == 3) {
      readSensors();
    }
  }

  //delays reading the sensors
  delay(1000);
}

//Soil Temp| Relative Humidity | Air Temperature| Visible Light| Infrared Right| Soil Humidity (relative measure)|button 1 state|button 2 state
void readSensors() {  
  checkDHT();
  checkSoilTemp();
  checkSunlight();
  checkSoilMoisture();
  Serial.print(", "); Serial.print(state1); 
  Serial.print(", "); Serial.print(state2);
  Serial.println();
}

void checkDHT() {
  // From Demo Code: Reading temperature or humidity takes about 250 milliseconds!
  // From Demo Code: Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)
   
  // readTempAndHumidity writes the humidity and temperature into a 2-element array
  // Air Temperature Temperature (degrees Celsius)
  // Air Humidity: written as an RH percentage (moisture content of the air over the maximum moisture content the air could have given its temperature) - AlexP
  if (!dht.readTempAndHumidity(temp_hum_val)) {
      Serial.print(temp_hum_val[0]);
      Serial.print(", ");
      Serial.print(temp_hum_val[1]);
  } else {
      Serial.print("Failed to get temperature and humidity value.");
  }
  Serial.print(", ");
}

void checkSoilTemp() {
  // From Demo Code: call sensors.requestTemperatures() to issue a global temperature 
  // From Demo Code: request to all devices on the bus
  sensors.requestTemperatures(); // Send the command to get temperatures
  // From Demo Code: We use the function ByIndex, and as an example get the temperature from the first sensor only.
  float tempC = sensors.getTempCByIndex(0);

  // Check if reading was successful
  if(tempC != DEVICE_DISCONNECTED_C) 
  {
    Serial.print(tempC);
  } 
  else
  {
    Serial.print("Error: Could not read temperature data");
  }
  Serial.print(", "); 
}

void checkSunlight() {
  //Visible Light (lm)
  Serial.print(Si1151.ReadVisible()); Serial.print(", ");
  //Infared Light (lm)
  Serial.print(Si1151.ReadIR()); Serial.print(", ");
}

//checks soil moisture and uses the values to turn on and off the water pump unless it is overridden by the button
void checkSoilMoisture() {
  //The sensor qualitatively measures humidity. Low values = high humidity, high values = low humidity
  int sensorValue = analogRead(A0);
  Serial.print(sensorValue);
  //if the button override is not on, use the measurement to determine whether the relay should turn on or of
  //meaning that the pump turns on if the soil is too dry
  if(sensorValue >= 740) {
    digitalWrite(5,HIGH);
  } else {
    digitalWrite(5,LOW);
  }
}

