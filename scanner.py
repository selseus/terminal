# Script to parse QR codes from MJEPG video stream
# The ideal was to integrate this into subsystem.py itself to save resources
# But, for some reason, urllib request stream running alongside a websocket server isn't going well
# In other words, I'm unable to access stream
# Fixes welcome

import cv2
import urllib.request
import numpy as np
from pyzbar import pyzbar

stream = urllib.request.urlopen('http://localhost:8865/stream.mjpg')
bytes = bytes()
while True:
    bytes += stream.read(1024)
    a = bytes.find(b'\xff\xd8')
    b = bytes.find(b'\xff\xd9')
    if a != -1 and b != -1:
        jpg = bytes[a:b+2]
        bytes = bytes[b+2:]
        i = cv2.imdecode(np.frombuffer(jpg, dtype=np.uint8), cv2.IMREAD_COLOR)
        f = open("codes.txt", "w")
        barcodes = pyzbar.decode(i)
        for barcode in barcodes:
            barcodeData = barcode.data.decode("utf-8")
            barcodeType = barcode.type
            print(barcodeData)
            f.write(barcodeData)

        if cv2.waitKey(1) == 27:
            exit(0)
