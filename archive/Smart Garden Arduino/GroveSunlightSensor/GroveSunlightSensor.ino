//Test code taken from https://wiki.seeedstudio.com/Grove-Sunlight_Sensor/ - Alex P
/*
    This is a demo to test Grove - Sunlight Sensor library

*/
//MOSFET
#include <Wire.h>
#include "Arduino.h"
#include "Si115X.h"

Si115X Si1151 = Si115X();

void setup() {

    
    
    Serial.begin(9600);
    Serial.println("Beginning Si1151!");
    //Set up relay at D5
    while (!Si1151.Begin()) {
        Serial.println("Si1151 is not ready!");
        delay(1000);
    }
    Serial.println("Si1151 is ready!");
}

void loop() {
    Serial.print("//--------------------------------------//\r\n");
    //Visible Light (lm)
    Serial.print("Vis: "); Serial.println(Si1151.ReadVisible());
    //Amount of Infared Light (lm)
    Serial.print("IR: "); Serial.println(Si1151.ReadIR());
    delay(1000);
}
