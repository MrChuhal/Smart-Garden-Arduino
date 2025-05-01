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
  //read sensors when the green button is not pressed
  if(state1) {
    readSensors();
  }

  //delays reading the sensors, but allows control of the pump via button
  delayReading();
}

//Soil Temp| Relative Humidity | Air Temperature| Visible Light| Infrared Right| Soil Humidity (relative measure)
void readSensors() {  
  checkDHT();
  checkSoilTemp();
  checkSunlight();
  checkSoilMoisture();
  Serial.print(", "); Serial.print(state1); 
  Serial.print(", "); Serial.print(state2);
  Serial.println();
}

//checks current state of button, turns on and off relay
void checkButton() {
  
  //read dual buttons
  state1 = digitalRead(BUTTON1);
  state2 = digitalRead(BUTTON2);
    
  if(!hold2 && !state2) {
    //button not having been held and beingp\ ressed
    on = !on;
    hold2 = 1;
    if(!on) {
      digitalWrite(5,LOW);
    }
  } else if(state2) {
    hold2 = 0;
  }
  if(on) {
    digitalWrite(5,HIGH);
  }
}

void delayReading() {
  unsigned long time = millis();
  
  while(millis() - time < DELAYTIME) {
    checkButton();
  }
}

void checkDHT() {
  //From demo code
  // Reading temperature or humidity takes about 250 milliseconds!
  // Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)
   
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
  //Soil Temperature collection
  // call sensors.requestTemperatures() to issue a global temperature 
  // request to all devices on the bus
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
  //if the button override is not on, use the measurement to determine whether the relay should turn on or off
  if(!on) {
    //meaning that the pump turns on if the soil is too dry
    if(sensorValue >= 740) {
      digitalWrite(5,HIGH);
    } else {
      digitalWrite(5,LOW);
    }
  }
  
}
