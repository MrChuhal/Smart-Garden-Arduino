#Raspberry Pi version of SensorManager.ino
#TODO: import python libraries to the Raspberry Pi

import seeed_dht
import seeed_ds18b20
#Find this library
import seeed_si115x
import RPi.GPIO as GPIO

# DHT11 at port 16
DHTsensor = seeed_dht.DHT("11", 16)
# One Wire Soil Temp Sensor at port 5 (???)
DS18B20 = seeed_ds18b20.grove_ds18b20()
#Sunlight Sensor at I2C
SI1151 = seeed_si115x.grove_si115x()
def checkDHT():
    # From Demo Code: Reading temperature or humidity takes about 250 milliseconds!
    # From Demo Code: Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)
   
    # readTempAndHumidity writes the humidity and temperature into a 2-element array
    # Air Temperature Temperature (degrees Celsius)
    # Air Humidity: written as an RH percentage (moisture content of the air over the maximum moisture content the air could have given its temperature) - AlexP
    #humi may be None, could be problematic
    humi, temp = DHTsensor.read()
    print(humi)
    print(temp)

def checkSoilTemp():
    temp_c = DS18B20.read_temp[0]
    print(temp_c)

def checkSunlight():
    vis = SI1151.ReadVisible
    ir = SI1151.ReadIR
    print(vis)
    print(ir)

def main():
	while True:
		checkDHT();    
		checkSunlight()    

if __name__ == "__main__":
    main()   
