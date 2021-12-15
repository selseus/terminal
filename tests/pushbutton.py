import RPi.GPIO as GPIO

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)

button = 4
GPIO.setup(button, GPIO.IN, pull_up_down=GPIO.PUD_UP)

while True:
    if(GPIO.input(button) == False):
        print("Button is pressed")
    else:
        print("Button is released")