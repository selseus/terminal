import * as React from 'react';
import '../styles/Result.css';
import happy from '../img/happy.gif';
import sad from '../img/problem.gif';
import config from '../configs';

function Marked({ user, temp, onTimeout }) {
    let [seconds, setSeconds] = React.useState(config.timeouts.result);
    React.useEffect(() => setTimeout(onTimeout, (config.timeouts.result + 1) * 1000), [onTimeout]);
    React.useEffect(() => setInterval(() => setSeconds(prevstate => (prevstate - 1)), 1000), []);
    return (
        <div className="result-root">
            <div style={{ flex: 8, display: 'flex', textAlign: 'left' }}>
                <div style={{ flex: 3 }} />
                <div className="profile">
                    <div style={{ flex: 1 }} />
                    <div style={{ flex: 10, display: 'flex' }}>
                        <div style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img src={user.image} alt={'Profile pic'} />
                        </div>
                        <div style={{ flex: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <h1>{user.name}</h1>
                            <h2>{user.batch}</h2>
                            <h2>{user.stream}</h2>
                            <h2>{user.email}</h2>
                        </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }} >
                        <h2>Page expires in <h1 style={{ color: temp <= 38.5 ? 'blue' : 'red' }} >{seconds} secs</h1> </h2>
                    </div>
                </div>
                <div className="result">
                    <div style={{ flex: 1 }} />
                    <div style={{ flex: 2, display: 'flex', flexDirection: 'row' }}>
                        <div style={{ flex: 2.3, display: 'flex', justifyContent: 'flex-end' }}>
                            <img src={temp <= 38.5 ? happy : sad} alt={'You are safe'} />
                        </div>
                        <div style={{ flex: 1 }} />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h1 style={{ color: temp <= 38.5 ? 'blue' : 'red' }} >{temp}&deg; C</h1>
                        <h2 style={{ color: temp <= 38.5 ? 'blue' : 'red' }}>{temp <= 38.5 ? 'You seem healthy' : 'You seem problematic'}</h2>
                        <h2>{temp <= 38.5 ? 'Welcome to STIST' : 'Please refrain from entry'}</h2>
                    </div>
                    <div style={{ flex: 0.5 }} />
                </div>
                <div style={{ flex: 2 }} />
            </div>
            <div style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h2>This result may take a while to reflect in your phone. It's OK to leave now.</h2>
            </div>
        </div>
    );
}

export default Marked;