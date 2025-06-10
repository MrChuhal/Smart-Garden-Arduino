from picamera2 import Picamera2
from libcamera import controls
import time
#directory to deposit images
pictureLocation = "/home/inesh/PictureFolder/"
#sets up the camera
picam2 = Picamera2()
picam2.start(show_preview=True)
picam2.set_controls({"AfMode": controls.AfModeEnum.Continuous})

def takePicture():
    picam2.start_and_capture_file(pictureLocation + "Capture" + str(round(time.time()*100)) + ".jpg")
#takes the picture, saves it as a unique file
for i in range(30):
    takePicture()

#Stops the camera
picam2.stop_preview()
picam2.stop()

def continuousPictures():
    #Take continuous pictures, conditional True in lieu of something to stop it.
    while(True):
        takePicture()
        time.sleep(0.5)
