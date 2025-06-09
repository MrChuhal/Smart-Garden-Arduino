# -*- coding: utf-8 -*-

RELAY_PIN = 5
BUTTON1_PIN = 22
BUTTON2_PIN = 24
DHT_PIN = 16

import time
import board
import busio
import digitalio
import RPi.GPIO as GPIO
import seeed_dht
from w1thermsensor import W1ThermSensor
import adafruit_veml6070

# Initialize GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setup(RELAY_PIN, GPIO.OUT)
GPIO.setup(BUTTON1_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(BUTTON2_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)

# Initialize sensors

dht_sensor = seeed_dht.DHT("11", DHT_PIN)
soil_temp_sensor = W1ThermSensor()
i2c = busio.I2C(board.GP3, board.GP2)
uv_sensor = adafruit_veml6070.VEML6070(i2c)

def read_dht():
    try:
        humidity, temperature = dht_sensor.read()
        print(f"Air Temp: {temperature:.1f}C, Humidity: {humidity:.1f}%")
    except Exception as e:
        print(f"DHT11 Error: {e}")

def read_soil_temp():
    try:
        temperature = soil_temp_sensor.get_temperature()
        print(f"Soil Temp: {temperature:.1f}C")
    except Exception as e:
        print(f"DS18B20 Error: {e}")

def read_uv():
    try:
        uv_index = uv_sensor.uv_index
        print(f"UV Index: {uv_index:.2f}")
    except Exception as e:
        print(f"UV Sensor Error: {e}")

def read_soil_moisture():
    # Placeholder for soil moisture reading
    # Replace with actual ADC reading code
    soil_moisture = 500  # Example value
    print(f"Soil Moisture: {soil_moisture}")
    return soil_moisture

def control_relay(soil_moisture):
    if soil_moisture < 300:
        GPIO.output(RELAY_PIN, GPIO.HIGH)
        print("Relay ON")
    else:
        GPIO.output(RELAY_PIN, GPIO.LOW)
        print("Relay OFF")

try:
    while True:
        read_dht()
        read_soil_temp()
        read_uv()
        moisture = read_soil_moisture()
        control_relay(moisture)
        time.sleep(3)
except KeyboardInterrupt:
    GPIO.cleanup()
