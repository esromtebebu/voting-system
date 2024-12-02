from flask import Flask, jsonify
import serial
import RPi.GPIO as GPIO
from time import sleep
from picamera import PiCamera
import base64

app = Flask(__name__)
PORT = 5000

def scan_rfid_card(ID):
        PortRF = serial.Serial('/dev/ttyAMA0',9600)
        while len(ID)<12:
                ID = ""
                print("Scanning card...")
                read_byte = PortRF.read()
                if read_byte==b"\x02":
                        for i in range(0, 12):
                                read_byte=PortRF.read()
                                ID += read_byte.decode('utf-8')
                print(f"{ID} scanned")
        return ID

def take_picture():
        camera = PiCamera()
        # camera.resolution = (800, 600)
        camera.resolution = (811, 608)
        camera.color_effects = (128, 128)
        camera.rotation = 180
        my_file = open('iris.jpg', 'wb')
        print("Camera ready")
        camera.start_preview()
        sleep(2)
        camera.capture(my_file)
        print("Picture taken.")
        encoded_string = ""
        with open("my_image.jpg", "rb") as img:
                encoded_string = base64.b64encode(img.read()).decode('utf-8')
        print(f"{encoded_string[:3]}")
        camera.close()
        return encoded_string

@app.route('/scan')
def scan():
    rfid = ""
    rfid = scan_rfid_card(rfid)
    return jsonify({"RFID": rfid})

@app.route('/capture')
def capture():
       encoded_string = ""
       encoded_string = take_picture()
       return jsonify({"Iris": encoded_string})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=PORT, debug=True)
