from smbus2 import SMBus
from mlx90614 import MLX90614
import time

bus = SMBus(1)
sensor = MLX90614(bus, address=0x5A)

while True:
    try:
        print("Temperature is "+str(round(sensor.get_object_1()+4, 1)))
        time.sleep(1)
    except KeyboardInterrupt:
        bus.close()
        quit()
