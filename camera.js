const express = require('express')
const app = express();
var cors = require('cors');
const port = 8865;

let lastFrameObj = {
    lastFrame: null
};

let videoStream = {
    getLastFrame: () => {
        return lastFrameObj.lastFrame;
    },
    acceptConnections: function (expressApp, cameraOptions, resourcePath, isVerbose) {
        const raspberryPiCamera = require('raspberry-pi-camera-native');

        if (!cameraOptions) {
            cameraOptions = {
                width: 1280,
                height: 720,
                fps: 16,
                encoding: 'JPEG',
                quality: 7
            };
        }

        // start capture
        raspberryPiCamera.start(cameraOptions);
        if (isVerbose) {
            console.log('Camera started.');
        }

        if (typeof resourcePath === 'undefined' || !resourcePath) {
            resourcePath = '/stream.mjpg';
        }

        // expressApp.use(function (req, res, next) {
        //     // Website you wish to allow to connect
        //     res.header('Access-Control-Allow-Origin', '*');
        //     // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        //     next();
        // })

        expressApp.get(resourcePath, cors(), (req, res) => {

            res.writeHead(200, {
                'Cache-Control': 'no-store, no-cache, must-revalidate, pre-check=0, post-check=0, max-age=0',
                Pragma: 'no-cache',
                Connection: 'close',
                'Content-Type': 'multipart/x-mixed-replace; boundary=--myboundary'
            });
            if (isVerbose)
                console.log('Accepting connection: ' + req.hostname);

            // add frame data event listener

            let isReady = true;

            let frameHandler = (frameData) => {
                try {
                    if (!isReady) {
                        return;
                    }

                    isReady = false;

                    if (isVerbose)
                        console.log('Writing frame: ' + frameData.length);

                    lastFrameObj.lastFrame = frameData;

                    res.write(`--myboundary\nContent-Type: image/jpg\nContent-length: ${frameData.length}\n\n`);
                    res.write(frameData, function () {
                        isReady = true;
                    });


                }
                catch (ex) {
                    if (isVerbose)
                        console.log('Unable to send frame: ' + ex);
                }
            }

            let frameEmitter = raspberryPiCamera.on('frame', frameHandler);

            req.on('close', () => {
                frameEmitter.removeListener('frame', frameHandler);

                if (isVerbose)
                    console.log('Connection terminated: ' + req.hostname);
            });
        });
    }
}

// start capture
// const videoStream = require('./camera/videoStream');
videoStream.acceptConnections(app, {
    width: 720,
    height: 720,
    fps: 30,
    encoding: 'JPEG',
    quality: 7 // lower is faster, less quality
},
    '/stream.mjpg', false);

app.use(express.static(__dirname + '/public'));
app.listen(port, () => console.log(`Camera stream is available now at http://localhost:${port}/stream.mjpg`));