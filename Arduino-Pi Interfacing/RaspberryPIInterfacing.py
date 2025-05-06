#Required for interfacing with Arduino
import serial
import time

ser = serial.Serial('/dev/ttyACM0',9600) #starts up a serial at this serial port with this baud rate
#TODO: find serial port for Arduino
time.sleep(2)
#reads data from the Serial
#ser.readline()
#writes data to serial.
#ser.write()
def turnOnPump(): ser.write(b'1\r\n')
def turnOffPump(): ser.write(b'2\r\n')
def receiveData(): ser.write(b'3\r\n')

while True:
	turnOffPump()
	receiveData()
	print(ser.readline())
	time.sleep(1)
