# terminal
The selseus terminal

## Installation
Installing this is just one of the most simplest tasks

1. Get the source

    ```
    git clone https://github.com/selseus/terminal.git
    ```
2. Change working directory
    
    ```
    cd terminal
    ```
3. Install dependencies

    ```
    npm install
    ```
4. Run it

    ```
    npm start
    ```

## Updating on the RPi
1. Compile the React app

    ```
    npm run build
    ```
2. Stop the running processes

    ```
    systemctl --user disable --now selseus.service
    ```
    and reboot

    ```
    sudo reboot
    ```
3. Transfer the generated `/build` directory to the Pi

    ```
    scp -r build pi@<IP address of Pi>:/home/pi/selseus
    ```
4. Change the scripts, if any, inside that directory
5. Restart the service
    ```
    systemctl --user enable --now selseus.service
    ```