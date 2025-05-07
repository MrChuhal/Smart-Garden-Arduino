from flask import Flask, request, jsonify
from flask_socketio import SocketIO
import serial
import time
import threading

app = Flask(__name__)
# initialize SocketIO for WebSocket support
socketio = SocketIO(app, cors_allowed_origins='*')

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
                parts = [p.strip() for p in raw.split(',') if p.strip()]
                if len(parts) >= 3:
                    last_serial_reading = parts[-3]
                else:
                    last_serial_reading = raw
                # emit new serial data to WebSocket clients
                socketio.emit('serial_data', {'last_serial_reading': last_serial_reading})
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
    socketio.run(app, host='0.0.0.0', port=5000)
