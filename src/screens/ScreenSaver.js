import * as React from 'react';
import config from '../configs';
import '../styles/ScreenSaver.css';

const dayjs = require('dayjs');

function ScreenSaver() {
    let [clock, setClock] = React.useState(dayjs());
    let [faded, fade] = React.useState(false);

    React.useEffect(() => setInterval(() => setClock(dayjs()), 1000), []);

    React.useEffect(() => setTimeout(() => fade(true), (config.timeouts.aod * 1000)));

    return (
        <div className="screensaver">
            <div className={faded ? 'wrap faded' : 'wrap'}>
                <div className="content">
                    <h1>{clock.format('hh:mm A')}</h1>
                    <h2>{clock.format('dddd, D MMMM YYYY')}</h2>
                </div>
            </div>
        </div>
    );
}

export default ScreenSaver;
