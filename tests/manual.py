import asyncio
import websockets
import json, time

def flash(times, delay):
    for x in range(times):
        print("Flash")
        time.sleep(delay)
        print("Flash")
        time.sleep(delay)

def beep(times, delay):
    for x in range(times):
        print("Beep")
        time.sleep(delay)
        print("Beep")
        time.sleep(delay)

async def echo(websocket, path):
    async for message in websocket:
        try:
            request = json.loads(message)
            if(request == "temperature"):
                print("Enter the value of shutdown: ")
                shutdown = input()
                if(shutdown == True):
                    quit()
                else:
                    try:
                        print("Enter the temperature for this iteration: ")
                        temperature = float(input())
                    except:
                        await websocket.close(1000)
                        quit()
                    if(temperature>=38.5):
                        beep(5, 0.5)
                        flash(5, 0.5)
                    elif(temperature>=35.5):
                        beep(2, 0.2)
                        flash(2, 0.2)
                    await websocket.send(json.dumps({"temperature": temperature}))
            elif(request=="warn"):
                beep(5, 0.5)
        except KeyboardInterrupt:
            await websocket.close(1000)
            quit()

starter = websockets.serve(echo, "localhost", 8081)
asyncio.get_event_loop().run_until_complete(starter)

try:
    print("Server is running")
    asyncio.get_event_loop().run_forever()
except KeyboardInterrupt:
    print("Server is stopping")
