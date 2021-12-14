import * as React from 'react';
import gif from '../img/home.gif';
import config from '../configs';
import '../styles/Home.css';

function Home({ onTimeout }) {
    React.useEffect(() => setTimeout(onTimeout, config.timeouts.screensaver * 1000), [onTimeout]);
    return (
        <div className="home-root">
            <img src={gif} alt={'Hi there'} />
            <h1>Hi there,</h1>
            <h2>Hold your hand near the sensor to continue</h2>
        </div>
    );
}

export default Home;
