from flask import Flask, request, jsonify
import serial
import time
import threading
#libraries needed for camera module
from picamera2 import Picamera2
from libcamera import controls

#directory to deposit images
pictureLocation = "/home/inesh/PictureFolder/"
#time delay (seconds) between taking pictures
cameradelay = 1800 #30 minutes
#setup the camera
picam2 = Picamera2()
picam2.start(show_preview=True)
picam2.set_controls({"AfMode": controls.AfModeEnum.Continuous})

#place to store the timestamp (for camera snapshots)
TStampFile = open("TimeStamp.txt","rt")
#If there is not readable timestamp information in the file, simply write the current time plus delay
if not isDigit(TStampFile.read()):
    TStampFile.close()
    TStampFile = open("TimeStamp.txt","wt")
    TStampFile.write(str(round(time.time()) + cameradelay))
TStampFile.close()

def keepTakingPictures():
    global TStampFile
    TStampFile = open("TimeStamp.txt","rt")
    #scheduled timestamp for next snapshot
    waitTime = int(TStampFile.read())
    TStampFile.close()
    while True:
        while time.time() < waitTime:
            pass

        #Take picture
        picam2.start_and_capture_file(pictureLocation + 
                                      "Capture" + 
                                      str(round(time.time()*100)) + 
                                      ".jpg")

        #sets new snapshot timestamp
        count = 0
        while time.time() > waitTime:
            #skips until the new timestamp is greater than the current time
            waitTime += cameradelay
            #Increment count
            count += 1
        if count > 0:
            print("In camera's inactivity, " + str(count) + " scheduled snapshots have been quit, with the next scheduled snapshot at " str(waitTime))
        
        TStampFile = open("TimeStamp.txt","wt")
        TStampFile.write(str(waitTime))
        TStampFile.close()

threading.Thread(target=keepTakingPictures, daemon=True).start()

app = Flask(__name__)

# Initialize serial communication
ser = serial.Serial('/dev/ttyACM0', 9600)  # Update with the correct serial port
# Allow time for the serial connection to initialize
time.sleep(2)

# Shared variable to store the last serial reading
last_serial_reading = ""

def turn_on_pump():
    ser.write(b'1\r\n')

def turn_off_pump():
    ser.write(b'2\r\n')

def auto():
    ser.write(b'3\r\n')

# Background thread to continuously read from the serial port
def read_serial():
    global last_serial_reading
    while True:
        try:
            if ser.in_waiting > 0:
                raw = ser.readline().decode('utf-8').strip()
                # assume CSV: last value is analog A0 reading
                parts = [p.strip() for p in raw.split(',') if p.strip()]
                # A0 reading is the third-to-last field in the CSV output
                if len(parts) >= 3:
                    last_serial_reading = parts[-3]
                else:
                    last_serial_reading = raw
        except Exception as e:
            print(f"Error reading from serial: {e}")

# Start the background thread
threading.Thread(target=read_serial, daemon=True).start()

@app.route('/pump', methods=['POST'])
def pump_control():
    try:
        data = request.json
        print(f"Received data: {data}")  # Log the received data
        state = data.get('state').lower()
        if state == 'on':
            turn_on_pump()
            return jsonify({"message": "Pump turned on"}), 200
        elif state == 'off':
            turn_off_pump()
            return jsonify({"message": "Pump turned off"}), 200
        elif state == 'auto':
            auto()
            return jsonify({"message": "Pump set to auto"}), 200
        else:
            return jsonify({"error": "Invalid state. Use 'on' or 'off'."}), 400
    except Exception as e:
        print(f"Error in pump_control: {e}")  # Log the error
        return jsonify({"error": "Invalid request format."}), 400

@app.route('/serial', methods=['GET'])
def get_serial_data():
    return jsonify({"last_serial_reading": last_serial_reading}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
