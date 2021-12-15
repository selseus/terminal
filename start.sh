#!/bin/bash

cd /home/pi/tempscan
python3 subsystem.py & chromium-browser --start-fullscreen build/index.html && fg

# Script starts our processes on boot