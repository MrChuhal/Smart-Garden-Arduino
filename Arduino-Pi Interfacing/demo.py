from flask import Flask, jsonify, request
import seeed_dht
import seeed_ds18b20
from seeed_si115x import grove_si115x
from grove.adc import ADC
import RPi.GPIO as GPIO
import threading
import time
import csv
from datetime import datetime

app = Flask(__name__)

# Initialize sensors
DHTsensor = seeed_dht.DHT("11", 16)  # GPIO 16 for DHT11
DS18B20 = seeed_ds18b20.grove_ds18b20()  # 1-Wire
SI1151 = grove_si115x()  # I2C
adc = ADC()

# Moisture sensor pins (Grove Hat analog)
moisture_pins = {
    "m0": 0,  # A0
    "m1": 2,  # A2
    "m2": 4,  # A4
    "m3": 6   # A6
}

# Pump relay setup
PUMP_GPIO = 18
GPIO.setmode(GPIO.BCM)
GPIO.setup(PUMP_GPIO, GPIO.OUT)

# Configuration
MOISTURE_THRESHOLD = 500
CSV_FILE = "/home/inesh/sensor_log.csv"
pump_mode = "auto"  # Default mode: auto

# --- Sensor Reading Functions ---

def read_dht():
    humi, temp = DHTsensor.read()
    return {
        "air_humidity": humi if humi is not None else "Error",
        "air_temperature": temp if temp is not None else "Error"
    }

def read_soil_temp():
    try:
        temp = DS18B20.read_temp[0]
        return {"soil_temperature": temp}
    except Exception as e:
        return {"soil_temperature": f"Error: {str(e)}"}

def read_sunlight():
    try:
        visible = SI1151.ReadHalfWord_VISIBLE()
        ir = SI1151.ReadHalfWord()
        return {
            "sunlight_visible": visible,
            "sunlight_ir": ir
        }
    except Exception as e:
        return {
            "sunlight_visible": f"Error: {str(e)}",
            "sunlight_ir": f"Error: {str(e)}"
        }

def read_moisture():
    try:
        return {
            key: adc.read(pin)
            for key, pin in moisture_pins.items()
        }
    except Exception as e:
		#NOTE: all values obtained by moisture sensors will be seen as errors if even one of them is.
        return {key: f"Error: {str(e)}" for key in moisture_pins}

# --- Pump Control ---

def control_pump(moisture_values):
    global pump_mode

    if pump_mode == "on":
        GPIO.output(PUMP_GPIO, GPIO.HIGH)
    elif pump_mode == "off":
        GPIO.output(PUMP_GPIO, GPIO.LOW)
    elif pump_mode == "auto":
		#if any moisture sensors obtains a reading below the moisture threshold, the pump will turn on until they are all below
        if any(val < MOISTURE_THRESHOLD for val in moisture_values.values() if isinstance(val, int)):
            GPIO.output(PUMP_GPIO, GPIO.HIGH)
        else:
            GPIO.output(PUMP_GPIO, GPIO.LOW)

# --- CSV Logging ---

def log_to_csv(data):
    fieldnames = ["timestamp"] + list(data.keys())
    file_exists = False
    try:
        file_exists = open(CSV_FILE).readline()
    except FileNotFoundError:
        pass

    with open(CSV_FILE, mode="a", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        if not file_exists:
            writer.writeheader()
        writer.writerow(data)

# --- Background Logger Thread ---

def background_logger():
    while True:
        try:
            dht_data = read_dht()
            soil_temp = read_soil_temp()
            sun = read_sunlight()
            moisture = read_moisture()

            all_data = {**dht_data, **soil_temp, **sun, **moisture}
            all_data["timestamp"] = datetime.now().isoformat()

            control_pump(moisture)
            log_to_csv(all_data)
        except Exception as e:
            print(f"[Logger Error] {e}")
        time.sleep(10)

threading.Thread(target=background_logger, daemon=True).start()

# --- API Routes ---

@app.route("/serial", methods=["GET"])
def get_sensor_data():
    data = {}
    data.update(read_dht())
    data.update(read_soil_temp())
    data.update(read_sunlight())
    data.update(read_moisture())
    return jsonify(data)

@app.route("/pump", methods=["POST"])
def set_pump_mode():
    global pump_mode
    try:
        data = request.get_json()
        mode = data.get("mode", "").lower()

        if mode not in ["auto", "on", "off"]:
            return jsonify({"error": "Invalid mode. Use 'auto', 'on', or 'off'."}), 400

        pump_mode = mode

        # Immediately apply on/off states
        if mode == "on":
            GPIO.output(PUMP_GPIO, GPIO.HIGH)
        elif mode == "off":
            GPIO.output(PUMP_GPIO, GPIO.LOW)

        return jsonify({"message": f"Pump mode set to '{mode}'."})
    except Exception as e:
        print(str(e))
        return jsonify({"error": f"Failed to set pump mode: {str(e)}"}), 500

# --- Start Server ---

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
