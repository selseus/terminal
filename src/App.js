import * as React from 'react';
import { w3cwebsocket as WebSocket } from "websocket";
import { io } from 'socket.io-client';
import logo from './img/logo.png';
import './styles/App.css';
import Home from './screens/Home';
import Scanner from './screens/Scanner';
import ScreenSaver from './screens/ScreenSaver';
import Marked from './screens/Marked';
import Duplicate from './screens/Duplicate';
import Failed from './screens/Failed';
import Shutdown from './screens/Shutdown';
import config from './configs';

require('dotenv').config()
const dayjs = require('dayjs');
var CryptoJS = require('crypto-js');
const sensor = new WebSocket('ws://localhost:8081');
const socket = io('https://api.selseus.com', { transports: ['websocket'] });

function App() {
  const isleeping = React.useRef(true);
  const shutdown = React.useRef(false);
  let [clock, setClock] = React.useState(dayjs());
  let [screensaver, switch_saver] = React.useState(false);
  let [online, setStatus] = React.useState(false);
  let [screen, setScreen] = React.useState(<Home onTimeout={() => { if (isleeping.current) { switch_saver(true); setScreen(<ScreenSaver />) } }} />);
  
  const set_home = () => {
    if(!shutdown.current) {
      isleeping.current = true;
      setScreen(<Home onTimeout={() => { if (isleeping.current) { switch_saver(true); setScreen(<ScreenSaver />) } }} />);
    }  
  }

  const wakeup = (temp) => {
    switch_saver(false);
    isleeping.current = false;
    setScreen(<Scanner camera={sensor} socket={socket} object={{ temperature: temp, date: clock.format('MMMM D, YYYY'), time: clock.format('hh:mm a'), object: clock.toISOString(), terminal: config.name }} onTimeout={set_home} />)
  };

  React.useEffect(() => setInterval(() => setClock(dayjs()), 1000), []);

  React.useEffect(() => {
    sensor.onopen = () => {
      setInterval(() => { if (isleeping.current) sensor.send(JSON.stringify('temperature')) }, 1000);
    };
    sensor.onmessage = (message) => {
      var temperature = JSON.parse(message.data).temperature;
      if (temperature >= 35.0 && isleeping.current && socket.connected) wakeup(temperature);
      if(temperature >= 38.5 && isleeping.current && socket.connected) sensor.send(JSON.stringify('warn'))
    };
    sensor.onclose = () => {
      try {
        socket.disconnect();
      } catch { }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isleeping.current = false
      shutdown.current = true;
      setScreen(<Shutdown />)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    socket.once('connect', () => setStatus(true))

    socket.on('connect_error', () => setStatus(false))

    socket.on('disconnect', () => setStatus(false))

    socket.on('marked_terminal', (msg) => {
      const message = JSON.parse(CryptoJS.AES.decrypt(JSON.parse(msg).cipher, process.env.REACT_APP_NETWORK_KEY).toString(CryptoJS.enc.Utf8))
      if (message.terminal === config.name) {
        sensor.send(JSON.stringify('camera_off'));
        // eslint-disable-next-line react-hooks/exhaustive-deps
        isleeping.current = false;
        setScreen(<Marked user={message.user} temp={message.temperature} onTimeout={set_home} />);
      }
    })

    socket.on('duplicate', (msg) => {
      const message = JSON.parse(CryptoJS.AES.decrypt(JSON.parse(msg).cipher, process.env.REACT_APP_NETWORK_KEY).toString(CryptoJS.enc.Utf8));
      if (message.terminal === config.name) {
        sensor.send(JSON.stringify('camera_off'));
        isleeping.current = false;
        setScreen(<Duplicate onTimeout={set_home} />)
      }
    })

    socket.on('failed', (msg) => {
      const message = JSON.parse(CryptoJS.AES.decrypt(JSON.parse(msg).cipher, process.env.REACT_APP_NETWORK_KEY).toString(CryptoJS.enc.Utf8));
      if (message.terminal === config.name) {
        sensor.send(JSON.stringify('camera_off'));
        isleeping.current = false;
        setScreen(<Failed onTimeout={set_home} />)
      }
    })

  }, [])

  return (
    <div className="App">
      {screensaver ? null : <div className="Header">
        <div style={{ flex: 0.5 }} />
        <div style={{ flex: 10, display: 'flex' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt={'Selseus'} height='50' width='40' />
            <h1>elseus</h1>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end' }}>
            <h2>{clock.format('hh:mm a')}</h2>
            <h3>{clock.format('dddd, MMMM D YYYY')}</h3>
            {online ? <h4>☁️ Online</h4> : <h4 style={{ color: 'yellow' }} >⚠️ Offline</h4>}
          </div>
        </div>
        <div style={{ flex: 0.5 }} />
      </div>}
      {screen}
      {screensaver ? null : <div className="Footer">
        {/* <p>Made with love at STIST</p> */}
      </div>}
    </div>
  );
}

export default App;
