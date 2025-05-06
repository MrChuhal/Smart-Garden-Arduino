#Required for interfacing with Arduino
import serial
import time

ser = serial.Serial('/dev/ttyACM0',9600) #starts up a serial at this serial port with this baud rate
#TODO: find serial port for Arduino

#reads data from the Serial
#ser.readline()
#writes data to serial.
#ser.write()
def turnOnPump(): ser.write(1)
def turnOffPump(): ser.write(2)
//would request for data to be received
def receiveData(): ser.wrtie(3)
while True:
	turnOffPump();
	time.sleep(0.01)
	receiveData();
	time.sleep(1)
	print(ser.readLine())
