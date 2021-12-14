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
GPIO.setup(buzzer, GPIO.OUT)
GPIO.setup(button, GPIO.IN, pull_up_down=GPIO.PUD_UP)

async def echo(websocket, path):
    async for message in websocket:
        try:
            request = json.loads(message)
            if(request == "temperature"):
                try:
                    temperature = round(sensor.get_object_1(), 1)
                except:
                    await websocket.close(1000)
                    os.system('sudo shutdown')
                    quit()
                if(temperature>=31.0):
                    for x in range(2):
                        GPIO.output(buzzer, GPIO.HIGH)
                        time.sleep(0.2)
                        GPIO.output(buzzer, GPIO.LOW)
                        time.sleep(0.2)
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
                    await websocket.send(json.dumps({"temperature": temperature}))
            elif(request=="warn"):
                for x in range(5):
                    GPIO.output(buzzer,GPIO.HIGH)
                    time.sleep(0.5)
                    GPIO.output(buzzer,GPIO.LOW)
                    time.sleep(0.5)
        except KeyboardInterrupt:
            try:
                bus.close()
                os.killpg(os.getpgid(camera.pid), signal.SIGTERM)
            except:
                pass
            await websocket.close(1000)
            quit()

starter = websockets.serve(echo, "localhost", 8765)
asyncio.get_event_loop().run_until_complete(starter)

try:
    print("Server is running")
    asyncio.get_event_loop().run_forever()
except KeyboardInterrupt:
    print("Server is stopping")
