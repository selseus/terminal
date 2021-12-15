import RPi.GPIO as GPIO
import os, time

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)

buzzer = 14
GPIO.setup(buzzer, GPIO.OUT)

try:
    while True:
        os.system('clear')
        print("Enter the number of times to beep: ")
        try:
            n = int(input())
        except:
            print("Unknown value\nDefaulting to beep for 2 seconds")
            n = 2
        for x in range(n):
            GPIO.output(buzzer, GPIO.HIGH)
            time.sleep(0.2)
            GPIO.output(buzzer, GPIO.LOW)
            time.sleep(0.2)
except KeyboardInterrupt:
    GPIO.output(buzzer, GPIO.LOW)
    quit()