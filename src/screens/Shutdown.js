import * as React from 'react';
import '../styles/Shutdown.css';
import Progress from '../components/Progress';
import config from '../configs';

function Shutdown() {
    let [seconds, setSeconds] = React.useState(config.timeouts.shutdown);
    React.useEffect(() => setInterval(() => setSeconds(prevstate => (prevstate - 1)), 1000), []);
    return (
        <div className="shutdown">
            <div style={{ flex: 1 }} />
            <div style={{ flex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Progress />
                <h1>Preparing to shutdown</h1>
                <h2>Terminal is suspending processes. Please wait...</h2>
                <p>T minus {seconds} seconds</p>
            </div>
            <div style={{ flex: 1 }} />
        </div>
    )
}

export default Shutdown;