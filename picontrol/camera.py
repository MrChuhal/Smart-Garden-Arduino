from flask import Flask, request, jsonify
import serial
import time
import threading
#libraries needed for camera module
from picamera2 import Picamera2

#directory to deposit images
pictureLocation = "/home/inesh/PictureFolder/"
#time delay (seconds) between taking pictures
cameradelay = 20 #30 minutes
#setup the camera
picam2 = Picamera2()
picam2.start(show_preview=True)
picam2.set_controls({"AfMode": controls.AfModeEnum.Continuous})

#place to store the timestamp (for camera snapshots)
timeFileLoc = "/home/inesh/TimeStamp.txt"
TStampFile = open(timeFileLoc,"rt")
#If there is not readable timestamp information in the file, simply write the current time plus delay
if not TStampFile.read().isdigit():
    TStampFile.close()
    TStampFile = open(timeFileLoc,"wt")
    TStampFile.write(str(round(time.time()) + cameradelay))
TStampFile.close()

def keepTakingPictures():
    global TStampFile
    TStampFile = open(timeFileLoc,"rt")
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
            print("In camera's inactivity, " + str(count) + " scheduled snapshots have been quit, with the next scheduled snapshot at " + str(waitTime))
        
        TStampFile = open(timeFileLoc,"wt")
        TStampFile.write(str(waitTime))
        TStampFile.close()

keepTakingPictures()
