import * as React from 'react';
import config from '../configs';
import '../styles/Scanner.css';
import Progress from '../components/Progress';
import QrScanner from 'qr-scanner';
// eslint-disable-next-line import/no-webpack-loader-syntax
import QrScannerWorkerPath from '!!file-loader!../../node_modules/qr-scanner/qr-scanner-worker.min.js';
QrScanner.WORKER_PATH = QrScannerWorkerPath;

var CryptoJS = require('crypto-js');
const QRCode = require('qrcode');
function Scanner({ object, onTimeout, socket }) {
    let [seconds, setSeconds] = React.useState(config.timeouts.scanner);
    let [camera_has_warmed, warm_camera] = React.useState(false);

    // timer
    React.useEffect(() => setTimeout(onTimeout, (config.timeouts.scanner + 1) * 1000), [onTimeout]);
    React.useEffect(() => setInterval(() => setSeconds(prevstate => (prevstate - 1)), 1000), []);
    React.useEffect(() => setTimeout(() => warm_camera(true), 2000), []);

    // React.useEffect(() => setTimeout(() => {
    //     warm_camera(true);
    //     var marked = false
    //     setInterval(() => {
    //         var img = new Image();
    //         img.src = 'http://localhost:8865/stream.mjpg';
    //         img.crossOrigin = "Anonymous";
    //         QrScanner.scanImage(img)
    //             .then((result) => {
    //                 try {
    //                     const data = JSON.parse(CryptoJS.AES.decrypt(result, process.env.REACT_APP_TERMINAL_KEY).toString(CryptoJS.enc.Utf8))
    //                     if (data.uid && !marked) {
    //                         socket.emit('mark', JSON.stringify({ cipher: CryptoJS.AES.encrypt(JSON.stringify({ uid: data.uid, temperature: object.temperature, date: object.date, time: object.time, object: object.object, terminal: object.terminal }), process.env.REACT_APP_NETWORK_KEY).toString() }));
    //                         marked = true;
    //                     }
    //                 } catch { }
    //             })
    //             .catch(error => console.log(error));
    //     }, 500)
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, 2000), []);

    React.useEffect(() => {
        const encrypt = (text) => { return CryptoJS.AES.encrypt(JSON.stringify(text), process.env.REACT_APP_TERMINAL_KEY).toString() }
        QRCode.toCanvas(encrypt(object), { errorCorrectionLevel: 'H', color: { light: '#000000ff', dark: '#ffffffff' }, scale: 8 }, function (err, canvas) {
            if (err) throw err

            var container = document.getElementById('qr-container')
            container.innerHTML = ''
            container.appendChild(canvas)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="scanner-root">
            <div style={{ flex: 3, display: 'flex', flexDirection: 'column' }} >
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <h2>Make it quick. This expires in <h2 style={{ color: seconds >= 11 ? 'blue' : 'red' }}>{seconds}s</h2></h2>
                </div>
                <div style={{ flex: 1, display: 'flex' }}>
                    <div style={{ flex: 0.2 }} />
                    <div className="instruction">
                        <h2>Show your code</h2>
                    </div>
                    <div style={{ flex: 0.2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <h2 style={{ color: 'gray' }}>OR</h2>
                    </div>
                    <div className="instruction">
                        <h2>Scan my code</h2>
                    </div>
                    <div style={{ flex: 0.2 }} />
                </div>
            </div>
            <div style={{ flex: 8, display: 'flex' }}>
                <div style={{ flex: 0.1 }} />
                <div className="camera-container">
                    {camera_has_warmed ? <img src={'http://localhost:8865/stream.mjpg'} id='feed' alt={'Camera Feed'} /> : <div><Progress /><h3>Camera is starting</h3></div>}
                </div>
                <div id='qr-container' className="qr-container">
                </div>
                <div style={{ flex: 0.1 }} />
            </div>
        </div>
    );
}

export default Scanner;
