import * as React from 'react';
import '../styles/Failed.css';
import gif from '../img/problem.gif';
import config from '../configs';

function Failed({ onTimeout }) {
    let [seconds, setSeconds] = React.useState(config.timeouts.duplicate);
    React.useEffect(() => setTimeout(onTimeout, (config.timeouts.duplicate + 1) * 1000), [onTimeout]);
    React.useEffect(() => setInterval(() => setSeconds(prevstate => (prevstate - 1)), 1000), []);
    return (
        <div className="failed-root">
            <div style={{ flex: 1 }} />
            <div style={{ flex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src={gif} alt={'Gotcha'} />
                <h1>Uh Oh...</h1>
                <h2>We encountered a fatal error while trying to mark your attendance</h2>
                <h2>Please contact staff advisor or inform system admins immediately</h2>
                <h1 style={{ marginTop: '1em' }}>Page expires in</h1>
                <p color={'red'}>{seconds}s</p>
            </div>
            <div style={{ flex: 1 }} />
        </div>
    );
}

export default Failed;