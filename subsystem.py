import asyncio
import websockets
import json, os, time, signal, subprocess
import RPi.GPIO as GPIO
from smbus2 import SMBus
from mlx90614 import MLX90614

shutdown = False
camera = subprocess.Popen("node camera", stdout=subprocess.PIPE, shell=True, preexec_fn=os.setsid)
bus = SMBus(1)
sensor = MLX90614(bus, address=0x5A)
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
buzzer = 14
button = 4
red = 19
green = 26
GPIO.setup(buzzer, GPIO.OUT)
GPIO.setup(green, GPIO.OUT)
GPIO.setup(red, GPIO.OUT)
GPIO.setup(button, GPIO.IN, pull_up_down=GPIO.PUD_UP)

def beep(times, delay):
    for x in range(times):
        GPIO.output(buzzer, GPIO.HIGH)
        time.sleep(delay)
        GPIO.output(buzzer, GPIO.LOW)
        time.sleep(delay)

def flash(times, delay, LED):
    for x in range(times):
        GPIO.output(LED, GPIO.HIGH)
        time.sleep(delay)
        GPIO.output(LED, GPIO.LOW)
        time.sleep(delay)

async def echo(websocket, path):
    async for message in websocket:
        try:
            request = json.loads(message)
            if(request == "temperature"):
                if(GPIO.input(button) == False):
                    try:
                        bus.close()
                        os.killpg(os.getpgid(camera.pid), signal.SIGTERM)
                    except:
                        pass
                    await websocket.close(1000)
                    os.system('sudo shutdown')
                    quit()
                else:
                    try:
                        temperature = round(sensor.get_object_1()+4, 1)
                    except:
                        await websocket.close(1000)
                        os.system('sudo shutdown')
                        quit()
                    await websocket.send(json.dumps({"temperature": temperature}))
                    if(temperature >= 38.5):
                        beep(5, 0.5)
                        flash(5, 0.5)
                    elif(temperature >= 35.5):
                        beep(2, 0.2)
                        flash(2, 0.2, green)
            elif(request=="warn"):
                beep(5, 0.5)
            elif(request == "code"):
                f = open("codes.txt", "r")
                await websocket.send(json.dumps({"code": f.read()}))
                f.close()
        except KeyboardInterrupt:
            try:
                bus.close()
                os.killpg(os.getpgid(camera.pid), signal.SIGTERM)
            except:
                pass
            await websocket.close(1000)
            quit()

starter = websockets.serve(echo, "localhost", 8081)
asyncio.get_event_loop().run_until_complete(starter)

try:
    print("Server is running")
    asyncio.get_event_loop().run_forever()
except KeyboardInterrupt:
    print("Server is stopping")
