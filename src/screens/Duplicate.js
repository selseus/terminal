import * as React from 'react';
import '../styles/Duplicate.css';
import gif from '../img/home.gif';
import config from '../configs';

function Duplicate({ onTimeout }) {
    let [seconds, setSeconds] = React.useState(config.timeouts.duplicate);
    React.useEffect(() => setTimeout(onTimeout, (config.timeouts.duplicate + 1) * 1000), [onTimeout]);
    React.useEffect(() => setInterval(() => setSeconds(prevstate => (prevstate - 1)), 1000), []);
    return (
        <div className="duplicate-root">
            <div style={{ flex: 1 }} />
            <div style={{ flex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src={gif} alt={'Gotcha'} />
                <h1>Gotcha...</h1>
                <h2>Seems like you already marked today's attendance</h2>
                <h2>You can't mark a day's attendance twice 😜</h2>
                <h1 style={{ marginTop: '1em' }}>Page expires in</h1>
                <p color={'blue'}>{seconds}s</p>
            </div>
            <div style={{ flex: 1 }} />
        </div>
    );
}

export default Duplicate;